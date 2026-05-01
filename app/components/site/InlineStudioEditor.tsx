"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useTransition,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from "react";
import type { StudioContent } from "../../lib/studio-content";
import { useStudio } from "../providers/StudioProvider";

type TextSelection = {
  kind: "text";
  path: string;
  label: string;
  multiline?: boolean;
  placeholder?: string;
};

type ImageSelection = {
  kind: "image";
  path: string;
  label: string;
  alt: string;
  placeholder?: string;
};

type ActionSelection = {
  kind: "action";
  path: string;
  label: string;
  labelPath: string;
  hrefPath: string;
};

export type InlineFieldSelection = TextSelection | ImageSelection | ActionSelection;

type InlineStudioEditorContextValue = {
  canEdit: boolean;
  isEditing: boolean;
  isSaving: boolean;
  content: StudioContent;
  selectedField: InlineFieldSelection | null;
  statusMessage: string;
  openEditor: () => void;
  closeEditor: () => void;
  toggleEditor: () => void;
  selectField: (field: InlineFieldSelection) => void;
  updateTextField: (path: string, value: string) => void;
  updateActionField: (
    path: string,
    nextValue: {
      label?: string;
      href?: string;
    }
  ) => void;
  setImageField: (path: string, value: string) => Promise<void>;
  uploadImageField: (path: string, file: File) => Promise<void>;
  saveChanges: () => void;
  discardChanges: () => void;
};

const InlineStudioEditorContext = createContext<InlineStudioEditorContextValue | null>(null);

const hiddenEditorPaths = new Set(["/admin", "/login", "/logout"]);

type PathSegment = string | number;
type PathContainer = Record<string, unknown> | unknown[];

function parsePath(path: string) {
  return path
    .split(".")
    .map((segment) => (/^\d+$/.test(segment) ? Number(segment) : segment)) as PathSegment[];
}

function getSegmentValue(source: unknown, segment: PathSegment) {
  if (Array.isArray(source)) {
    return typeof segment === "number" ? source[segment] : undefined;
  }

  if (source && typeof source === "object") {
    return (source as Record<string, unknown>)[String(segment)];
  }

  return undefined;
}

function setSegmentValue(target: PathContainer, segment: PathSegment, value: unknown) {
  if (Array.isArray(target) && typeof segment === "number") {
    target[segment] = value;
    return;
  }

  (target as Record<string, unknown>)[String(segment)] = value;
}

function getValueAtPath(source: unknown, path: string) {
  return parsePath(path).reduce<unknown>((currentValue, segment) => {
    return getSegmentValue(currentValue, segment);
  }, source);
}

function setValueAtPath<T>(source: T, path: string, nextValue: unknown): T {
  const segments = parsePath(path);
  const root: PathContainer = Array.isArray(source)
    ? [...source]
    : { ...(source as Record<string, unknown>) };
  let currentDraft: PathContainer = root;
  let currentSource: unknown = source;

  for (let index = 0; index < segments.length - 1; index += 1) {
    const segment = segments[index];
    const nextSegment = segments[index + 1];
    const sourceChild = getSegmentValue(currentSource, segment);
    const draftChild =
      sourceChild !== undefined
        ? Array.isArray(sourceChild)
          ? [...sourceChild]
          : { ...(sourceChild as Record<string, unknown>) }
        : typeof nextSegment === "number"
          ? []
          : {};

    setSegmentValue(currentDraft, segment, draftChild);
    currentDraft = draftChild as PathContainer;
    currentSource = sourceChild;
  }

  setSegmentValue(currentDraft, segments[segments.length - 1], nextValue);

  return root as T;
}

function collectManagedImageReferences(value: unknown, bucket = new Set<string>()) {
  if (typeof value === "string" && value.startsWith("asset://")) {
    bucket.add(value);
    return bucket;
  }

  if (Array.isArray(value)) {
    value.forEach((entry) => collectManagedImageReferences(entry, bucket));
    return bucket;
  }

  if (value && typeof value === "object") {
    Object.values(value).forEach((entry) => collectManagedImageReferences(entry, bucket));
  }

  return bucket;
}

function matchesSelection(
  selectedField: InlineFieldSelection | null,
  field: InlineFieldSelection
) {
  return selectedField?.kind === field.kind && selectedField.path === field.path;
}

function EditorField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      {children}
    </label>
  );
}

function InlineEditorDrawer({
  selectedField,
}: {
  selectedField: InlineFieldSelection | null;
}) {
  const {
    content,
    isSaving,
    saveChanges,
    discardChanges,
    setImageField,
    statusMessage,
    updateActionField,
    uploadImageField,
  } = useInlineStudioEditor();
  const { resolveImageUrl } = useStudio();
  const selectedValue = selectedField ? getValueAtPath(content, selectedField.path) : "";

  return (
    <aside
      aria-label="Studio inline editor"
      className="inline-editor-drawer"
      role="dialog"
    >
      <div className="inline-editor-panel">
        <div className="inline-editor-panel__header">
          <div>
            <span className="hero-eyebrow">Inline Editor</span>
            <h2>Edit the page directly as you review it.</h2>
            <p>Click any highlighted text or image on the page to update that exact section.</p>
          </div>
          <div className="inline-editor-panel__actions">
            <button className="cta-button" disabled={isSaving} onClick={saveChanges} type="button">
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
            <button className="ghost-button" onClick={discardChanges} type="button">
              Exit Editor
            </button>
          </div>
        </div>

        {statusMessage ? <p className="admin-save-message">{statusMessage}</p> : null}

        {selectedField ? (
          <section className="inline-editor-card">
            <div className="inline-editor-card__header">
              <h3>{selectedField.label}</h3>
              <span>{selectedField.kind === "action" ? "Button" : selectedField.kind}</span>
            </div>

            {selectedField.kind === "text" ? (
              <p>
                Edit this copy directly on the page. Click into the highlighted text and type, then
                save when you are finished.
              </p>
            ) : null}

            {selectedField.kind === "action" ? (
              <div className="admin-stack">
                <EditorField label="Button label">
                  <input
                    onChange={(event) =>
                      updateActionField(selectedField.path, { label: event.target.value })
                    }
                    type="text"
                    value={String(getValueAtPath(content, selectedField.labelPath) ?? "")}
                  />
                </EditorField>
                <EditorField label="Link">
                  <input
                    onChange={(event) =>
                      updateActionField(selectedField.path, { href: event.target.value })
                    }
                    type="text"
                    value={String(getValueAtPath(content, selectedField.hrefPath) ?? "")}
                  />
                </EditorField>
              </div>
            ) : null}

            {selectedField.kind === "image" ? (
              <div className="admin-stack">
                <div className="inline-editor-image-preview">
                  {selectedValue ? (
                    <img alt={selectedField.alt} src={resolveImageUrl(String(selectedValue))} />
                  ) : (
                    <span>No image selected yet.</span>
                  )}
                </div>
                <EditorField label="Image URL">
                  <input
                    onChange={(event) => {
                      void setImageField(selectedField.path, event.target.value);
                    }}
                    placeholder={selectedField.placeholder ?? "Paste image URL"}
                    type="text"
                    value={String(selectedValue ?? "")}
                  />
                </EditorField>
                <label className="upload-button">
                  <span>Upload image</span>
                  <input
                    accept="image/*"
                    onChange={(event) => {
                      const file = event.target.files?.[0];

                      if (!file) {
                        return;
                      }

                      void uploadImageField(selectedField.path, file);
                      event.target.value = "";
                    }}
                    type="file"
                  />
                </label>
              </div>
            ) : null}
          </section>
        ) : (
          <section className="inline-editor-card">
            <div className="inline-editor-card__header">
              <h3>Choose something on the page</h3>
            </div>
            <p>
              Click highlighted copy to edit it directly on the page. Click a button or image to
              update its details here while keeping the page in view.
            </p>
          </section>
        )}

        <div className="inline-editor-card">
          <div className="inline-editor-card__header">
            <h3>More controls</h3>
          </div>
          <p>
            Need to add or remove classes, events, team members, or schedule items? Use the full
            management view for structural changes.
          </p>
          <Link className="ghost-button" href="/admin">
            Open Full Manager
          </Link>
        </div>
      </div>
    </aside>
  );
}

export function InlineStudioEditorProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const {
    content: savedContent,
    deleteImageAsset,
    isAdmin,
    isReady,
    updateContent,
    uploadImage,
  } = useStudio();
  const [isEditing, setIsEditing] = useState(false);
  const [draftContent, setDraftContent] = useState(savedContent);
  const [selectedField, setSelectedField] = useState<InlineFieldSelection | null>(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [isSaving, startTransition] = useTransition();
  const contentRef = useRef(savedContent);
  const draftRef = useRef(draftContent);
  const stagedUploadRefsRef = useRef<Set<string>>(new Set());

  const canEdit = isReady && isAdmin && !hiddenEditorPaths.has(pathname);
  const displayedContent = canEdit && isEditing ? draftContent : savedContent;

  useEffect(() => {
    contentRef.current = savedContent;
    if (!isEditing) {
      setDraftContent(savedContent);
    }
  }, [isEditing, savedContent]);

  useEffect(() => {
    draftRef.current = draftContent;
  }, [draftContent]);

  function pruneStagedRefs(nextContent: StudioContent) {
    const persistedRefs = collectManagedImageReferences(nextContent);

    [...stagedUploadRefsRef.current].forEach((assetRef) => {
      if (persistedRefs.has(assetRef)) {
        stagedUploadRefsRef.current.delete(assetRef);
      }
    });
  }

  async function cleanupTransientUploads(
    nextDraft: StudioContent,
    persistedValue: StudioContent = contentRef.current
  ) {
    const persistedRefs = collectManagedImageReferences(persistedValue);
    const nextRefs = collectManagedImageReferences(nextDraft);
    const stagedRefs = [...stagedUploadRefsRef.current];

    if (!stagedRefs.length) {
      return;
    }

    const removableRefs = stagedRefs.filter(
      (assetRef) => !persistedRefs.has(assetRef) && !nextRefs.has(assetRef)
    );

    if (!removableRefs.length) {
      return;
    }

    const results = await Promise.allSettled(
      removableRefs.map(async (assetRef) => {
        await deleteImageAsset(assetRef);
        return assetRef;
      })
    );

    results.forEach((result) => {
      if (result.status === "fulfilled") {
        stagedUploadRefsRef.current.delete(result.value);
      }
    });
  }

  async function cleanupDiscardedTransientUploads(
    persistedValue: StudioContent = contentRef.current
  ) {
    const persistedRefs = collectManagedImageReferences(persistedValue);
    const stagedRefs = [...stagedUploadRefsRef.current];

    if (!stagedRefs.length) {
      return;
    }

    const removableRefs = stagedRefs.filter((assetRef) => !persistedRefs.has(assetRef));

    if (!removableRefs.length) {
      return;
    }

    const results = await Promise.allSettled(
      removableRefs.map(async (assetRef) => {
        await deleteImageAsset(assetRef);
        return assetRef;
      })
    );

    results.forEach((result) => {
      if (result.status === "fulfilled") {
        stagedUploadRefsRef.current.delete(result.value);
      }
    });
  }

  function applyDraft(nextDraft: StudioContent) {
    draftRef.current = nextDraft;
    setDraftContent(nextDraft);
    setStatusMessage("");
  }

  function updateTextField(path: string, value: string) {
    applyDraft(setValueAtPath(draftRef.current, path, value));
  }

  function updateActionField(
    path: string,
    nextValue: {
      label?: string;
      href?: string;
    }
  ) {
    const selectedAction =
      selectedField?.kind === "action" && selectedField.path === path ? selectedField : null;
    const labelPath = selectedAction?.labelPath ?? `${path}.label`;
    const hrefPath = selectedAction?.hrefPath ?? `${path}.href`;
    let nextDraft = draftRef.current;

    if (nextValue.label !== undefined) {
      nextDraft = setValueAtPath(nextDraft, labelPath, nextValue.label);
    }

    if (nextValue.href !== undefined) {
      nextDraft = setValueAtPath(nextDraft, hrefPath, nextValue.href);
    }

    applyDraft(nextDraft);
  }

  async function setImageField(path: string, value: string) {
    const nextDraft = setValueAtPath(draftRef.current, path, value);
    applyDraft(nextDraft);
    await cleanupTransientUploads(nextDraft);
  }

  async function uploadImageField(path: string, file: File) {
    const nextImage = await uploadImage(file);

    if (nextImage.startsWith("asset://")) {
      stagedUploadRefsRef.current.add(nextImage);
    }

    await setImageField(path, nextImage);
  }

  function selectField(field: InlineFieldSelection) {
    if (!canEdit) {
      return;
    }

    setSelectedField(field);
    setIsEditing(true);
  }

  function openEditor() {
    if (!canEdit) {
      return;
    }

    setDraftContent(contentRef.current);
    draftRef.current = contentRef.current;
    setStatusMessage("");
    setIsEditing(true);
  }

  function saveChanges() {
    startTransition(async () => {
      try {
        const persistedContent = contentRef.current;

        await updateContent(draftRef.current);
        await cleanupTransientUploads(draftRef.current, persistedContent);
        pruneStagedRefs(draftRef.current);
        setStatusMessage("Changes saved.");
      } catch (error) {
        setStatusMessage(error instanceof Error ? error.message : "Unable to save changes.");
      }
    });
  }

  function discardChanges() {
    void (async () => {
      await cleanupDiscardedTransientUploads(contentRef.current);
      setSelectedField(null);
      setStatusMessage("");
      setIsEditing(false);
      setDraftContent(contentRef.current);
      draftRef.current = contentRef.current;
    })();
  }

  function closeEditor() {
    discardChanges();
  }

  function toggleEditor() {
    if (isEditing) {
      closeEditor();
      return;
    }

    openEditor();
  }

  useEffect(() => {
    if (!hiddenEditorPaths.has(pathname)) {
      if (isEditing) {
        setSelectedField(null);
      }

      return;
    }

    if (isEditing) {
      discardChanges();
    }
  }, [isEditing, pathname]);

  const value: InlineStudioEditorContextValue = {
    canEdit,
    isEditing,
    isSaving,
    content: displayedContent,
    selectedField,
    statusMessage,
    openEditor,
    closeEditor,
    toggleEditor,
    selectField,
    updateTextField,
    updateActionField,
    setImageField,
    uploadImageField,
    saveChanges,
    discardChanges,
  };

  return (
    <InlineStudioEditorContext.Provider value={value}>
      {children}
      {canEdit && isEditing ? (
        <div className="inline-editor-layer">
          <InlineEditorDrawer selectedField={selectedField} />
        </div>
      ) : null}
    </InlineStudioEditorContext.Provider>
  );
}

export function useInlineStudioEditor() {
  const context = useContext(InlineStudioEditorContext);

  if (!context) {
    throw new Error("useInlineStudioEditor must be used inside InlineStudioEditorProvider.");
  }

  return context;
}

export function useEditableStudioContent() {
  return useInlineStudioEditor().content;
}

export function useEditableElement(
  field: InlineFieldSelection,
  className?: string
) {
  const { canEdit, isEditing, selectedField, selectField } = useInlineStudioEditor();
  const isSelected = matchesSelection(selectedField, field);
  const interactive = canEdit && isEditing;

  return {
    className: `${className ?? ""}${interactive ? " inline-editable" : ""}${isSelected ? " inline-editable--selected" : ""}`.trim(),
    "data-inline-label": interactive ? field.label : undefined,
    onClick: interactive
      ? (event: MouseEvent<HTMLElement>) => {
          event.preventDefault();
          event.stopPropagation();
          selectField(field);
        }
      : undefined,
    role: interactive ? "button" : undefined,
    tabIndex: interactive ? 0 : undefined,
    onKeyDown: interactive
      ? (event: KeyboardEvent<HTMLElement>) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            selectField(field);
          }
        }
      : undefined,
  };
}

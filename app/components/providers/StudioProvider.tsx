"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  clearStoredFirebaseSession,
  deleteFirebaseAsset,
  ensureFreshFirebaseSession,
  getAssetIdFromReference,
  isAssetReference,
  loadFirebaseAssetDataUrl,
  loadFirebaseContactMessages,
  loadFirebaseRegistrations,
  loadFirebaseStudioContent,
  loadStoredFirebaseSession,
  registerWithFirebase,
  restoreFirebaseSeedContent,
  restoreFirebaseSession,
  saveFirebaseContactMessage,
  saveFirebaseRegistration,
  saveFirebaseStudioContent,
  sendFirebasePasswordReset,
  signInWithFirebase,
  uploadFirebaseAsset,
} from "../../lib/firebase-backend";
import { isFirebaseConfigured } from "../../lib/firebase-env";
import {
  seedStudioContent,
  type StudioContent,
} from "../../lib/studio-content";
import {
  fileToDataUrl,
  loadStudioContent,
  resetStudioContent,
  saveContactMessage,
  saveRegistration,
  saveStudioContent,
} from "../../lib/studio-storage";
import type {
  AuthMode,
  ContactInput,
  ContactSubmission,
  RegistrationInput,
  RegistrationSubmission,
  StudioSession,
} from "../../lib/studio-types";

type StudioContextValue = {
  content: StudioContent;
  registrations: RegistrationSubmission[];
  contactMessages: ContactSubmission[];
  session: StudioSession | null;
  adminSession: StudioSession | null;
  isAdmin: boolean;
  isReady: boolean;
  authMode: AuthMode;
  firebaseConfigured: boolean;
  updateContent: (nextContent: StudioContent) => Promise<void>;
  restoreSeedContent: () => Promise<void>;
  submitRegistration: (payload: RegistrationInput) => Promise<void>;
  submitContactMessage: (payload: ContactInput) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (displayName: string, email: string, password: string) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  uploadImage: (file: File) => Promise<string>;
  deleteImageAsset: (src: string) => Promise<void>;
  resolveImageUrl: (src: string) => string;
};

const StudioContext = createContext<StudioContextValue | null>(null);

function collectAssetIds(value: unknown, bucket = new Set<string>()) {
  if (typeof value === "string" && isAssetReference(value)) {
    bucket.add(getAssetIdFromReference(value));
    return bucket;
  }

  if (Array.isArray(value)) {
    value.forEach((entry) => collectAssetIds(entry, bucket));
    return bucket;
  }

  if (value && typeof value === "object") {
    Object.values(value).forEach((entry) => collectAssetIds(entry, bucket));
  }

  return bucket;
}

function diffRemovedAssetIds(previousValue: unknown, nextValue: unknown) {
  const previousAssetIds = collectAssetIds(previousValue);
  const nextAssetIds = collectAssetIds(nextValue);

  return [...previousAssetIds].filter((assetId) => !nextAssetIds.has(assetId));
}

export function StudioProvider({ children }: { children: ReactNode }) {
  const firebaseConfigured = isFirebaseConfigured();
  const authMode: AuthMode = firebaseConfigured ? "firebase" : "preview";
  const [content, setContent] = useState(seedStudioContent);
  const [registrations, setRegistrations] = useState<RegistrationSubmission[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactSubmission[]>([]);
  const [session, setSession] = useState<StudioSession | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [assetMap, setAssetMap] = useState<Record<string, string>>({});
  const assetMapRef = useRef<Record<string, string>>({});

  useEffect(() => {
    assetMapRef.current = assetMap;
  }, [assetMap]);

  function pruneAssetMap(assetIds: string[]) {
    if (!assetIds.length) {
      return;
    }

    setAssetMap((current) => {
      const nextMap = { ...current };
      let didChange = false;

      assetIds.forEach((assetId) => {
        if (assetId in nextMap) {
          delete nextMap[assetId];
          didChange = true;
        }
      });

      return didChange ? nextMap : current;
    });
  }

  async function deleteImageAsset(src: string) {
    if (!firebaseConfigured || !isAssetReference(src)) {
      return;
    }

    const nextSession = await requireSession("admin");
    const assetId = getAssetIdFromReference(src);

    await deleteFirebaseAsset(assetId, nextSession);
    pruneAssetMap([assetId]);
  }

  async function cleanupRemovedAssets(assetIds: string[], nextSession: StudioSession) {
    if (!assetIds.length) {
      return;
    }

    const results = await Promise.allSettled(
      assetIds.map(async (assetId) => {
        await deleteFirebaseAsset(assetId, nextSession);
        return assetId;
      })
    );

    const deletedAssetIds = results
      .filter(
        (result): result is PromiseFulfilledResult<string> => result.status === "fulfilled"
      )
      .map((result) => result.value);
    const failedCount = results.length - deletedAssetIds.length;

    pruneAssetMap(deletedAssetIds);

    if (failedCount > 0) {
      throw new Error(
        failedCount === 1
          ? "Changes saved, but one replaced image could not be cleared."
          : "Changes saved, but some replaced images could not be cleared."
      );
    }
  }

  async function loadAdminInbox(nextSession: StudioSession) {
    if (nextSession.role !== "admin") {
      setRegistrations([]);
      setContactMessages([]);
      return;
    }

    const hydratedSession = await ensureFreshFirebaseSession(nextSession);

    if (!hydratedSession) {
      clearStoredFirebaseSession();
      setSession(null);
      setRegistrations([]);
      setContactMessages([]);
      throw new Error("Your session expired. Sign in again.");
    }

    if (hydratedSession !== nextSession) {
      setSession(hydratedSession);
    }

    const [nextRegistrations, nextMessages] = await Promise.all([
      loadFirebaseRegistrations(hydratedSession),
      loadFirebaseContactMessages(hydratedSession),
    ]);

    setRegistrations(nextRegistrations);
    setContactMessages(nextMessages);
  }

  async function requireSession(requiredRole?: "admin") {
    if (!session) {
      throw new Error("Please log in first.");
    }

    const refreshedSession = await ensureFreshFirebaseSession(session);

    if (!refreshedSession) {
      clearStoredFirebaseSession();
      setSession(null);
      setRegistrations([]);
      setContactMessages([]);
      throw new Error("Your session expired. Sign in again.");
    }

    if (refreshedSession !== session) {
      setSession(refreshedSession);
    }

    if (requiredRole === "admin" && refreshedSession.role !== "admin") {
      throw new Error("Admin access required.");
    }

    return refreshedSession;
  }

  useEffect(() => {
    let cancelled = false;

    async function initialize() {
      try {
        if (!firebaseConfigured) {
          if (cancelled) {
            return;
          }

          setContent(loadStudioContent());
          setRegistrations([]);
          setContactMessages([]);
          setSession(null);
          setIsReady(true);
          return;
        }

        const [remoteContent, restoredSession] = await Promise.all([
          loadFirebaseStudioContent(),
          restoreFirebaseSession(loadStoredFirebaseSession()),
        ]);

        if (cancelled) {
          return;
        }

        setContent(remoteContent);
        setSession(restoredSession);

        if (restoredSession?.role === "admin") {
          const [nextRegistrations, nextMessages] = await Promise.all([
            loadFirebaseRegistrations(restoredSession),
            loadFirebaseContactMessages(restoredSession),
          ]);

          if (cancelled) {
            return;
          }

          setRegistrations(nextRegistrations);
          setContactMessages(nextMessages);
        }

        setIsReady(true);
      } catch {
        if (cancelled) {
          return;
        }

        setSession(null);
        setRegistrations([]);
        setContactMessages([]);
        setIsReady(true);
      }
    }

    void initialize();

    return () => {
      cancelled = true;
    };
  }, [firebaseConfigured]);

  useEffect(() => {
    if (!firebaseConfigured) {
      return;
    }

    let cancelled = false;
    const missingAssetIds = [...collectAssetIds(content)].filter(
      (assetId) => !assetMapRef.current[assetId]
    );

    if (!missingAssetIds.length) {
      return;
    }

    void Promise.all(
      missingAssetIds.map(async (assetId) => {
        const dataUrl = await loadFirebaseAssetDataUrl(assetId);
        return [assetId, dataUrl] as const;
      })
    )
      .then((entries) => {
        if (cancelled) {
          return;
        }

        setAssetMap((current) => {
          const nextMap = { ...current };

          entries.forEach(([assetId, dataUrl]) => {
            if (dataUrl) {
              nextMap[assetId] = dataUrl;
            }
          });

          return nextMap;
        });
      })
      .catch(() => {
        // Missing or invalid asset documents should not break the page shell.
      });

    return () => {
      cancelled = true;
    };
  }, [content, firebaseConfigured]);

  async function updateContent(nextContent: StudioContent) {
    if (firebaseConfigured) {
      const nextSession = await requireSession("admin");
      const removedAssetIds = diffRemovedAssetIds(content, nextContent);

      await saveFirebaseStudioContent(nextContent, nextSession);
      setContent(nextContent);
      await cleanupRemovedAssets(removedAssetIds, nextSession);
      return;
    }

    saveStudioContent(nextContent);
    setContent(nextContent);
  }

  async function restoreSeedContent() {
    if (firebaseConfigured) {
      const nextSession = await requireSession("admin");
      const removedAssetIds = diffRemovedAssetIds(content, seedStudioContent);

      await restoreFirebaseSeedContent(nextSession);
      setContent(seedStudioContent);
      await cleanupRemovedAssets(removedAssetIds, nextSession);
      return;
    }

    resetStudioContent();
    setContent(seedStudioContent);
  }

  async function submitRegistration(payload: RegistrationInput) {
    if (firebaseConfigured) {
      const nextRegistration = await saveFirebaseRegistration(payload);

      if (session?.role === "admin") {
        setRegistrations((current) => [nextRegistration, ...current]);
      }

      return;
    }

    const nextRegistration = saveRegistration(payload);
    setRegistrations((current) => [nextRegistration, ...current]);
  }

  async function submitContactMessage(payload: ContactInput) {
    if (firebaseConfigured) {
      const nextMessage = await saveFirebaseContactMessage(payload);

      if (session?.role === "admin") {
        setContactMessages((current) => [nextMessage, ...current]);
      }

      return;
    }

    const nextMessage = saveContactMessage(payload);
    setContactMessages((current) => [nextMessage, ...current]);
  }

  async function login(email: string, password: string) {
    if (firebaseConfigured) {
      const nextSession = await signInWithFirebase(email, password);
      setSession(nextSession);
      await loadAdminInbox(nextSession);
      return;
    }

    throw new Error("Account access is not available right now.");
  }

  async function register(displayName: string, email: string, password: string) {
    if (!firebaseConfigured) {
      throw new Error("Account creation is not available right now.");
    }

    const nextSession = await registerWithFirebase(displayName, email, password);
    setSession(nextSession);
    await loadAdminInbox(nextSession);
  }

  async function sendPasswordReset(email: string) {
    if (!firebaseConfigured) {
      throw new Error("Password reset is not available right now.");
    }

    await sendFirebasePasswordReset(email);
  }

  async function logout() {
    if (firebaseConfigured) {
      clearStoredFirebaseSession();
    }

    setSession(null);
    setRegistrations([]);
    setContactMessages([]);
  }

  async function uploadImage(file: File) {
    if (!firebaseConfigured) {
      return fileToDataUrl(file);
    }

    const nextSession = await requireSession("admin");
    const uploadedAsset = await uploadFirebaseAsset(file, nextSession);

    setAssetMap((current) => ({
      ...current,
      [uploadedAsset.assetId]: uploadedAsset.dataUrl,
    }));

    return uploadedAsset.assetUrl;
  }

  function resolveImageUrl(src: string) {
    if (!isAssetReference(src)) {
      return src;
    }

    return assetMap[getAssetIdFromReference(src)] ?? "";
  }

  const value: StudioContextValue = {
    content,
    registrations,
    contactMessages,
    session,
    adminSession: session?.role === "admin" ? session : null,
    isAdmin: session?.role === "admin" ? true : false,
    isReady,
    authMode,
    firebaseConfigured,
    updateContent,
    restoreSeedContent,
    submitRegistration,
    submitContactMessage,
    login,
    register,
    sendPasswordReset,
    logout,
    uploadImage,
    deleteImageAsset,
    resolveImageUrl,
  };

  return <StudioContext.Provider value={value}>{children}</StudioContext.Provider>;
}

export function useStudio() {
  const context = useContext(StudioContext);

  if (!context) {
    throw new Error("useStudio must be used inside StudioProvider.");
  }

  return context;
}

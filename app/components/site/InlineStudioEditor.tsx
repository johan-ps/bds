"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { STUDIO_MANAGER_TOGGLE_EVENT } from "../../lib/studio-manager";
import { useStudio } from "../providers/StudioProvider";
import { StudioManagerContents } from "./AdminDashboard";

const hiddenEditorPaths = new Set(["/admin", "/login", "/logout"]);

export function InlineStudioEditor() {
  const pathname = usePathname();
  const { isAdmin, isReady } = useStudio();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isAdmin) {
      setIsOpen(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    function handleToggle() {
      setIsOpen((current) => !current);
    }

    window.addEventListener(STUDIO_MANAGER_TOGGLE_EVENT, handleToggle);

    return () => {
      window.removeEventListener(STUDIO_MANAGER_TOGGLE_EVENT, handleToggle);
    };
  }, []);

  if (!isReady || !isAdmin || hiddenEditorPaths.has(pathname)) {
    return null;
  }

  return (
    <>
      {isOpen ? (
        <div className="inline-editor-layer">
          <button
            aria-label="Close studio management"
            className="inline-editor-backdrop"
            onClick={() => setIsOpen(false)}
            type="button"
          />
          <aside
            aria-label="Studio management"
            aria-modal="true"
            className="inline-editor-drawer"
            id="inline-studio-editor"
            role="dialog"
          >
            <StudioManagerContents embedded onClose={() => setIsOpen(false)} />
          </aside>
        </div>
      ) : null}
    </>
  );
}

"use client";

import { seedStudioContent, type StudioContent } from "./studio-content";
import type {
  ContactSubmission,
  RegistrationSubmission,
} from "./studio-types";

const CONTENT_KEY = "bds-studio-content";
const REGISTRATIONS_KEY = "bds-registrations";
const CONTACT_KEY = "bds-contact-messages";

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `bds-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function parseStoredJson<T>(value: string | null, fallback: T) {
  if (!value) return fallback;

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function loadStudioContent() {
  if (typeof window === "undefined") return seedStudioContent;

  return parseStoredJson<StudioContent>(
    window.localStorage.getItem(CONTENT_KEY),
    seedStudioContent
  );
}

export function saveStudioContent(content: StudioContent) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CONTENT_KEY, JSON.stringify(content));
}

export function resetStudioContent() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(CONTENT_KEY);
}

export function loadRegistrations() {
  if (typeof window === "undefined") return [] as RegistrationSubmission[];

  return parseStoredJson<RegistrationSubmission[]>(
    window.localStorage.getItem(REGISTRATIONS_KEY),
    []
  );
}

export function saveRegistration(
  payload: Omit<RegistrationSubmission, "id" | "createdAt">
) {
  const nextEntry: RegistrationSubmission = {
    ...payload,
    id: createId(),
    createdAt: new Date().toISOString(),
  };
  const nextRegistrations = [nextEntry, ...loadRegistrations()];

  window.localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(nextRegistrations));

  return nextEntry;
}

export function loadContactMessages() {
  if (typeof window === "undefined") return [] as ContactSubmission[];

  return parseStoredJson<ContactSubmission[]>(
    window.localStorage.getItem(CONTACT_KEY),
    []
  );
}

export function saveContactMessage(
  payload: Omit<ContactSubmission, "id" | "createdAt">
) {
  const nextEntry: ContactSubmission = {
    ...payload,
    id: createId(),
    createdAt: new Date().toISOString(),
  };
  const nextMessages = [nextEntry, ...loadContactMessages()];

  window.localStorage.setItem(CONTACT_KEY, JSON.stringify(nextMessages));

  return nextEntry;
}

export function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("Unable to read file."));
    };

    reader.onerror = () => reject(new Error("Unable to read file."));
    reader.readAsDataURL(file);
  });
}

import { getFirebaseEnv, isFirebaseConfigured } from "./firebase-env";
import { seedStudioContent, type StudioContent } from "./studio-content";
import type {
  ContactInput,
  ContactSubmission,
  RegistrationInput,
  RegistrationSubmission,
  StudioSession,
  UserRole,
} from "./studio-types";

const AUTH_SESSION_KEY = "bds-auth-session";

const FIRESTORE_COLLECTIONS = {
  admins: "adminEmails",
  assets: "assets",
  contactMessages: "contactMessages",
  registrations: "registrations",
  siteContent: "siteContent",
  users: "users",
} as const;

type FirebaseAuthResponse = {
  localId: string;
  email: string;
  idToken: string;
  refreshToken: string;
  expiresIn: string;
  displayName?: string;
};

type FirebaseLookupResponse = {
  users?: Array<{
    localId: string;
    email?: string;
    displayName?: string;
    emailVerified?: boolean;
  }>;
};

type FirebaseRefreshResponse = {
  user_id: string;
  id_token: string;
  refresh_token: string;
  expires_in: string;
};

type FirestoreDocument = {
  name?: string;
  fields?: Record<string, FirestoreValue>;
};

type FirestoreValue =
  | { nullValue: null }
  | { stringValue: string }
  | { booleanValue: boolean }
  | { integerValue: string }
  | { doubleValue: number }
  | { arrayValue: { values?: FirestoreValue[] } }
  | { mapValue: { fields?: Record<string, FirestoreValue> } };

type StoredAsset = {
  fileName: string;
  contentType: string;
  dataUrl: string;
  uploadedAt: string;
  uploadedBy: string;
};

type UploadedAsset = {
  assetId: string;
  assetUrl: string;
  dataUrl: string;
};

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `bds-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function assetReference(assetId: string) {
  return `asset://${assetId}`;
}

export function isAssetReference(value: string) {
  return value.startsWith("asset://");
}

export function getAssetIdFromReference(value: string) {
  return value.replace(/^asset:\/\//, "");
}

function buildIdentityUrl(path: string) {
  const { apiKey } = getFirebaseEnv();
  return `https://identitytoolkit.googleapis.com/v1/${path}?key=${apiKey}`;
}

function buildRefreshUrl() {
  const { apiKey } = getFirebaseEnv();
  return `https://securetoken.googleapis.com/v1/token?key=${apiKey}`;
}

function encodeDocumentPath(path: string) {
  return path
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

function buildFirestoreDocumentUrl(path: string) {
  const { projectId } = getFirebaseEnv();
  return `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${encodeDocumentPath(
    path
  )}`;
}

function buildFirestoreCollectionUrl(collectionId: string) {
  const { projectId } = getFirebaseEnv();
  return `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${encodeURIComponent(
    collectionId
  )}`;
}

function humanizeFirebaseError(message: string) {
  const normalized = message.replace(/^auth\//, "").toUpperCase();

  switch (normalized) {
    case "EMAIL_EXISTS":
      return "That email address is already registered.";
    case "EMAIL_NOT_FOUND":
    case "INVALID_LOGIN_CREDENTIALS":
      return "The email or password is incorrect.";
    case "INVALID_PASSWORD":
      return "The email or password is incorrect.";
    case "USER_DISABLED":
      return "This account has been disabled.";
    case "WEAK_PASSWORD : PASSWORD SHOULD BE AT LEAST 6 CHARACTERS":
    case "WEAK_PASSWORD":
      return "Use a password with at least 6 characters.";
    case "INVALID_EMAIL":
      return "Enter a valid email address.";
    case "TOO_MANY_ATTEMPTS_TRY_LATER":
      return "Too many attempts. Try again later.";
    case "TOKEN_EXPIRED":
    case "INVALID_ID_TOKEN":
      return "Your session expired. Sign in again.";
    default:
      return message
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/^./, (character) => character.toUpperCase());
  }
}

async function parseErrorResponse(response: Response) {
  try {
    const payload = (await response.json()) as { error?: { message?: string } };
    return humanizeFirebaseError(payload.error?.message ?? "Request failed.");
  } catch {
    return `Request failed with status ${response.status}.`;
  }
}

async function fetchJson<T>(url: string, init?: RequestInit) {
  const response = await fetch(url, init);

  if (!response.ok) {
    throw new Error(await parseErrorResponse(response));
  }

  return (await response.json()) as T;
}

async function fetchMaybeJson<T>(url: string, init?: RequestInit) {
  const response = await fetch(url, init);

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(await parseErrorResponse(response));
  }

  return (await response.json()) as T;
}

function toFirestoreValue(value: unknown): FirestoreValue {
  if (value === null || value === undefined) {
    return { nullValue: null };
  }

  if (Array.isArray(value)) {
    return {
      arrayValue: {
        values: value.map((item) => toFirestoreValue(item)),
      },
    };
  }

  if (typeof value === "string") {
    return { stringValue: value };
  }

  if (typeof value === "boolean") {
    return { booleanValue: value };
  }

  if (typeof value === "number") {
    return Number.isInteger(value)
      ? { integerValue: String(value) }
      : { doubleValue: value };
  }

  if (typeof value === "object") {
    const fields = Object.entries(value).reduce<Record<string, FirestoreValue>>(
      (accumulator, [key, entry]) => {
        accumulator[key] = toFirestoreValue(entry);
        return accumulator;
      },
      {}
    );

    return {
      mapValue: {
        fields,
      },
    };
  }

  return { stringValue: String(value) };
}

function fromFirestoreValue(value: FirestoreValue): unknown {
  if ("nullValue" in value) {
    return null;
  }

  if ("stringValue" in value) {
    return value.stringValue;
  }

  if ("booleanValue" in value) {
    return value.booleanValue;
  }

  if ("integerValue" in value) {
    return Number(value.integerValue);
  }

  if ("doubleValue" in value) {
    return value.doubleValue;
  }

  if ("arrayValue" in value) {
    return (value.arrayValue.values ?? []).map((entry) => fromFirestoreValue(entry));
  }

  if ("mapValue" in value) {
    return fromFirestoreFields(value.mapValue.fields);
  }

  return null;
}

function fromFirestoreFields(fields?: Record<string, FirestoreValue>) {
  if (!fields) {
    return {};
  }

  return Object.entries(fields).reduce<Record<string, unknown>>((accumulator, [key, value]) => {
    accumulator[key] = fromFirestoreValue(value);
    return accumulator;
  }, {});
}

function buildFirestoreDocument(data: Record<string, unknown>) {
  return {
    fields: Object.entries(data).reduce<Record<string, FirestoreValue>>(
      (accumulator, [key, value]) => {
        accumulator[key] = toFirestoreValue(value);
        return accumulator;
      },
      {}
    ),
  };
}

function decodeFirestoreDocument<T>(document: FirestoreDocument | null) {
  if (!document) {
    return null;
  }

  return fromFirestoreFields(document.fields) as T;
}

async function getFirestoreDocument<T>(path: string, idToken?: string) {
  const document = await fetchMaybeJson<FirestoreDocument>(buildFirestoreDocumentUrl(path), {
    headers: idToken ? { Authorization: `Bearer ${idToken}` } : undefined,
  });

  return decodeFirestoreDocument<T>(document);
}

async function putFirestoreDocument(
  path: string,
  data: Record<string, unknown>,
  idToken?: string
) {
  await fetchJson<FirestoreDocument>(buildFirestoreDocumentUrl(path), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
    },
    body: JSON.stringify(buildFirestoreDocument(data)),
  });
}

async function listFirestoreCollection<T>(collectionId: string, idToken?: string) {
  const response = await fetchMaybeJson<{ documents?: FirestoreDocument[] }>(
    `${buildFirestoreCollectionUrl(collectionId)}?pageSize=200`,
    {
      headers: idToken ? { Authorization: `Bearer ${idToken}` } : undefined,
    }
  );

  return (response?.documents ?? [])
    .map((document) => decodeFirestoreDocument<T>(document))
    .filter((document): document is T => Boolean(document));
}

function saveStoredSession(session: StudioSession) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
}

export function loadStoredFirebaseSession() {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = window.localStorage.getItem(AUTH_SESSION_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawValue) as StudioSession;
    return parsed.authMode === "firebase" ? parsed : null;
  } catch {
    return null;
  }
}

export function clearStoredFirebaseSession() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(AUTH_SESSION_KEY);
}

async function lookupAccount(idToken: string) {
  const payload = await fetchJson<FirebaseLookupResponse>(buildIdentityUrl("accounts:lookup"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ idToken }),
  });

  const user = payload.users?.[0];

  if (!user?.localId || !user.email) {
    throw new Error("Unable to read the current account.");
  }

  return {
    uid: user.localId,
    email: normalizeEmail(user.email),
    displayName: user.displayName ?? "",
    emailVerified: Boolean(user.emailVerified),
  };
}

async function refreshIdToken(refreshToken: string) {
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });

  return fetchJson<FirebaseRefreshResponse>(buildRefreshUrl(), {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
}

async function fetchUserRole(idToken: string, email: string): Promise<UserRole> {
  const adminRecord = await getFirestoreDocument<{ active?: boolean }>(
    `${FIRESTORE_COLLECTIONS.admins}/${normalizeEmail(email)}`,
    idToken
  );

  if (!adminRecord) {
    return "member";
  }

  return adminRecord.active === false ? "member" : "admin";
}

async function saveUserProfile(session: StudioSession) {
  await putFirestoreDocument(
    `${FIRESTORE_COLLECTIONS.users}/${session.uid}`,
    {
      email: session.email,
      displayName: session.displayName,
      role: session.role,
      lastLoginAt: new Date().toISOString(),
      createdAt: session.signedInAt,
    },
    session.idToken
  );
}

async function buildFirebaseSession(
  authResponse: FirebaseAuthResponse,
  signedInAt = new Date().toISOString()
) {
  const account = await lookupAccount(authResponse.idToken);
  const role = await fetchUserRole(authResponse.idToken, account.email);

  const session: StudioSession = {
    uid: account.uid,
    email: account.email,
    displayName: account.displayName || authResponse.displayName || "",
    role,
    authMode: "firebase",
    signedInAt,
    emailVerified: account.emailVerified,
    idToken: authResponse.idToken,
    refreshToken: authResponse.refreshToken,
    expiresAt: Date.now() + Number(authResponse.expiresIn) * 1000,
  };

  await saveUserProfile(session);
  saveStoredSession(session);

  return session;
}

export async function signInWithFirebase(email: string, password: string) {
  if (!isFirebaseConfigured()) {
    throw new Error("Firebase is not configured.");
  }

  const response = await fetchJson<FirebaseAuthResponse>(
    buildIdentityUrl("accounts:signInWithPassword"),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: normalizeEmail(email),
        password,
        returnSecureToken: true,
      }),
    }
  );

  return buildFirebaseSession(response);
}

export async function registerWithFirebase(
  displayName: string,
  email: string,
  password: string
) {
  if (!isFirebaseConfigured()) {
    throw new Error("Firebase is not configured.");
  }

  const response = await fetchJson<FirebaseAuthResponse>(buildIdentityUrl("accounts:signUp"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: normalizeEmail(email),
      password,
      returnSecureToken: true,
    }),
  });

  if (displayName.trim()) {
    if (!response.idToken) {
      throw new Error("Firebase did not return an ID token during sign up.");
    }

    await fetchJson<{ displayName?: string }>(buildIdentityUrl("accounts:update"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        idToken: response.idToken,
        displayName: displayName.trim(),
        returnSecureToken: true,
      }),
    });
  }

  return buildFirebaseSession(response);
}

export async function sendFirebasePasswordReset(email: string) {
  if (!isFirebaseConfigured()) {
    throw new Error("Firebase is not configured.");
  }

  await fetchJson(buildIdentityUrl("accounts:sendOobCode"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      requestType: "PASSWORD_RESET",
      email: normalizeEmail(email),
    }),
  });
}

export async function restoreFirebaseSession(session: StudioSession | null) {
  if (!session?.refreshToken || session.authMode !== "firebase") {
    clearStoredFirebaseSession();
    return null;
  }

  try {
    let nextSession = session;

    if (!nextSession.expiresAt || nextSession.expiresAt - Date.now() < 60_000) {
      const refreshed = await refreshIdToken(nextSession.refreshToken);

      nextSession = {
        ...nextSession,
        uid: refreshed.user_id,
        idToken: refreshed.id_token,
        refreshToken: refreshed.refresh_token,
        expiresAt: Date.now() + Number(refreshed.expires_in) * 1000,
      };
    }

    const account = await lookupAccount(nextSession.idToken ?? "");
    const role = await fetchUserRole(nextSession.idToken ?? "", account.email);

    const hydratedSession: StudioSession = {
      ...nextSession,
      uid: account.uid,
      email: account.email,
      displayName: account.displayName || nextSession.displayName,
      role,
      emailVerified: account.emailVerified,
      authMode: "firebase",
    };

    await saveUserProfile(hydratedSession);
    saveStoredSession(hydratedSession);

    return hydratedSession;
  } catch {
    clearStoredFirebaseSession();
    return null;
  }
}

export async function ensureFreshFirebaseSession(session: StudioSession) {
  if (
    session.authMode !== "firebase" ||
    !session.refreshToken ||
    !session.expiresAt ||
    session.expiresAt - Date.now() >= 60_000
  ) {
    return session;
  }

  return (await restoreFirebaseSession(session)) ?? null;
}

export async function loadFirebaseStudioContent() {
  if (!isFirebaseConfigured()) {
    return seedStudioContent;
  }

  return (
    (await getFirestoreDocument<StudioContent>(
      `${FIRESTORE_COLLECTIONS.siteContent}/default`
    )) ?? seedStudioContent
  );
}

export async function saveFirebaseStudioContent(content: StudioContent, session: StudioSession) {
  await putFirestoreDocument(
    `${FIRESTORE_COLLECTIONS.siteContent}/default`,
    content as unknown as Record<string, unknown>,
    session.idToken
  );
}

export async function restoreFirebaseSeedContent(session: StudioSession) {
  await saveFirebaseStudioContent(seedStudioContent, session);
}

export async function loadFirebaseRegistrations(session: StudioSession) {
  const registrations = await listFirestoreCollection<RegistrationSubmission>(
    FIRESTORE_COLLECTIONS.registrations,
    session.idToken
  );

  return registrations.sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

export async function saveFirebaseRegistration(payload: RegistrationInput) {
  const nextRegistration: RegistrationSubmission = {
    ...payload,
    id: createId(),
    createdAt: new Date().toISOString(),
  };

  await putFirestoreDocument(
    `${FIRESTORE_COLLECTIONS.registrations}/${nextRegistration.id}`,
    nextRegistration as unknown as Record<string, unknown>
  );

  return nextRegistration;
}

export async function loadFirebaseContactMessages(session: StudioSession) {
  const messages = await listFirestoreCollection<ContactSubmission>(
    FIRESTORE_COLLECTIONS.contactMessages,
    session.idToken
  );

  return messages.sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

export async function saveFirebaseContactMessage(payload: ContactInput) {
  const nextMessage: ContactSubmission = {
    ...payload,
    id: createId(),
    createdAt: new Date().toISOString(),
  };

  await putFirestoreDocument(
    `${FIRESTORE_COLLECTIONS.contactMessages}/${nextMessage.id}`,
    nextMessage as unknown as Record<string, unknown>
  );

  return nextMessage;
}

async function fileToImageBitmap(file: File) {
  if ("createImageBitmap" in window) {
    return createImageBitmap(file);
  }

  const dataUrl = await new Promise<string>((resolve, reject) => {
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

  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Unable to load image."));
    image.src = dataUrl;
  });
}

async function compressImage(file: File) {
  const image = await fileToImageBitmap(file);
  const width = "naturalWidth" in image ? image.naturalWidth : image.width;
  const height = "naturalHeight" in image ? image.naturalHeight : image.height;
  const maxDimension = 1600;
  const scale = Math.min(1, maxDimension / Math.max(width, height));
  const targetWidth = Math.max(1, Math.round(width * scale));
  const targetHeight = Math.max(1, Math.round(height * scale));
  const canvas = document.createElement("canvas");

  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Unable to prepare image upload.");
  }

  context.drawImage(image, 0, 0, targetWidth, targetHeight);

  const dataUrl = canvas.toDataURL("image/jpeg", 0.82);

  if (dataUrl.length > 900_000) {
    throw new Error("Image is still too large. Use a smaller file before uploading.");
  }

  return {
    contentType: "image/jpeg",
    dataUrl,
  };
}

export async function uploadFirebaseAsset(file: File, session: StudioSession): Promise<UploadedAsset> {
  if (session.role !== "admin" || session.authMode !== "firebase" || !session.idToken) {
    throw new Error("Only admin accounts can upload images.");
  }

  const assetId = createId();
  const compressed = await compressImage(file);
  const asset: StoredAsset = {
    fileName: file.name,
    contentType: compressed.contentType,
    dataUrl: compressed.dataUrl,
    uploadedAt: new Date().toISOString(),
    uploadedBy: session.email,
  };

  await putFirestoreDocument(
    `${FIRESTORE_COLLECTIONS.assets}/${assetId}`,
    asset as unknown as Record<string, unknown>,
    session.idToken
  );

  return {
    assetId,
    assetUrl: assetReference(assetId),
    dataUrl: compressed.dataUrl,
  };
}

export async function loadFirebaseAssetDataUrl(assetId: string) {
  const asset = await getFirestoreDocument<StoredAsset>(
    `${FIRESTORE_COLLECTIONS.assets}/${assetId}`
  );

  return asset?.dataUrl ?? "";
}

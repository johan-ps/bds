export type RegistrationSubmission = {
  id: string;
  name: string;
  email: string;
  phone: string;
  dancerAge: string;
  styleInterest: string;
  experience: string;
  note: string;
  createdAt: string;
};

export type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  phone: string;
  inquiryType: string;
  message: string;
  createdAt: string;
};

export type RegistrationInput = Omit<RegistrationSubmission, "id" | "createdAt">;
export type ContactInput = Omit<ContactSubmission, "id" | "createdAt">;

export type UserRole = "member" | "admin";
export type AuthMode = "firebase" | "preview";

export type StudioSession = {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  authMode: AuthMode;
  signedInAt: string;
  emailVerified: boolean;
  idToken?: string;
  refreshToken?: string;
  expiresAt?: number;
};

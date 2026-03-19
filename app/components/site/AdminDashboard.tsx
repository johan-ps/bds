"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition, type FormEvent, type ReactNode } from "react";
import {
  seedStudioContent,
  type EventPost,
  type GalleryItem,
  type InstructorProfile,
  type PackageOption,
  type ScheduleDay,
  type StudioContent,
  type StyleOffering,
} from "../../lib/studio-content";
import { useStudio } from "../providers/StudioProvider";

type AdminTab =
  | "overview"
  | "styles"
  | "schedule"
  | "team"
  | "events"
  | "gallery"
  | "studio"
  | "inbox";

function updateItem<T>(items: T[], index: number, updater: (item: T) => T) {
  return items.map((item, itemIndex) => (itemIndex === index ? updater(item) : item));
}

function listToLines(list: string[]) {
  return list.join("\n");
}

function linesToList(value: string) {
  return value
    .split("\n")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function TabButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className={`admin-tab ${active ? "admin-tab--active" : ""}`}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}

function AdminField({
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

function AdminTextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (nextValue: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      type="text"
    />
  );
}

function AdminTextArea({
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  value: string;
  onChange: (nextValue: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      rows={rows}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
    />
  );
}

function ImageUploadField({
  label,
  image,
  onChange,
  onUpload,
}: {
  label: string;
  image: string;
  onChange: (nextValue: string) => void;
  onUpload: (file: File) => Promise<void>;
}) {
  return (
    <div className="admin-image-field">
      <AdminField label={label}>
        <AdminTextInput value={image} onChange={onChange} placeholder="Paste image URL" />
      </AdminField>
      <label className="upload-button">
        <span>Upload image</span>
        <input
          type="file"
          accept="image/*"
          onChange={async (event) => {
            const file = event.target.files?.[0];

            if (!file) return;
            await onUpload(file);
            event.target.value = "";
          }}
        />
      </label>
    </div>
  );
}

function AdminSectionCard({
  title,
  children,
  action,
}: {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className="admin-section-card">
      <div className="admin-section-card__header">
        <h3>{title}</h3>
        {action}
      </div>
      <div className="admin-section-card__body">{children}</div>
    </section>
  );
}

export function LoginPageContent() {
  const router = useRouter();
  const {
    firebaseConfigured,
    isAdmin,
    isReady,
    login,
    logout,
    register,
    sendPasswordReset,
    session,
  } = useStudio();
  const [mode, setMode] = useState<"signin" | "register">("signin");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState(
    firebaseConfigured ? "" : demoAdminCredentials.email
  );
  const [password, setPassword] = useState(
    firebaseConfigured ? "" : demoAdminCredentials.password
  );
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (session && isAdmin) {
      router.replace("/admin");
    }
  }, [isAdmin, router, session]);

  if (!isReady) {
    return (
      <div className="page-shell">
        <section className="locked-panel reveal">
          <h1>Loading account access</h1>
          <p>Please wait a moment.</p>
        </section>
      </div>
    );
  }

  if (session && !isAdmin && firebaseConfigured) {
    return (
      <div className="page-shell">
        <section className="locked-panel reveal">
          <span className="hero-eyebrow">Welcome back</span>
          <h1>You are already signed in.</h1>
          <p>You can continue exploring classes, events, and studio updates from here.</p>
          <div className="credential-card">
            <strong>{session.displayName || "BollyFit member"}</strong>
            <span>{session.email}</span>
            <span>BollyFit Dance Studio</span>
          </div>
          <div className="admin-topbar__actions">
            <Link className="cta-button" href="/booking">
              Register for classes
            </Link>
            <button
              className="ghost-button"
              onClick={() => {
                void logout();
              }}
              type="button"
            >
              Logout
            </button>
          </div>
        </section>
      </div>
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(async () => {
      try {
        if (mode === "register") {
          if (password !== confirmPassword) {
            throw new Error("Passwords do not match.");
          }

          await register(displayName, email, password);
          setInfoMessage("Your account has been created.");
        } else {
          await login(email, password);
          setInfoMessage("Welcome back.");
        }

        setErrorMessage("");
        if (!firebaseConfigured) {
          router.push("/admin");
          return;
        }

        router.push("/");
      } catch (error) {
        setInfoMessage("");
        setErrorMessage(error instanceof Error ? error.message : "Unable to sign in.");
      }
    });
  }

  function handlePasswordReset() {
    if (!firebaseConfigured) {
      return;
    }

    startTransition(async () => {
      try {
        await sendPasswordReset(email);
        setErrorMessage("");
        setInfoMessage("Reset instructions have been sent to your email.");
      } catch (error) {
        setInfoMessage("");
        setErrorMessage(
          error instanceof Error ? error.message : "Unable to send reset instructions."
        );
      }
    });
  }

  return (
    <div className="page-shell">
      <section className="auth-panel reveal">
        <div className="auth-panel__copy">
          <span className="hero-eyebrow">Member Access</span>
          <h1>Sign in to stay connected with the studio.</h1>
          <p>
            Manage your account, stay close to studio updates, and keep your next class inquiry
            moving.
          </p>
          {!firebaseConfigured ? (
            <div className="credential-card">
              <strong>Studio management access</strong>
              <span>Please use the sign-in details provided by your studio team.</span>
              <span>If you need help accessing your account, contact the studio directly.</span>
            </div>
          ) : (
            <div className="credential-card">
              <strong>New here?</strong>
              <span>Create an account to get started.</span>
              <span>If you help run the studio, management tools will appear after sign-in.</span>
            </div>
          )}
        </div>
        <div className="auth-panel__form">
          {firebaseConfigured ? (
            <div className="admin-tabbar">
              <TabButton
                active={mode === "signin"}
                label="Sign In"
                onClick={() => setMode("signin")}
              />
              <TabButton
                active={mode === "register"}
                label="Create Account"
                onClick={() => setMode("register")}
              />
            </div>
          ) : null}
          <form className="studio-form" onSubmit={handleSubmit}>
            {mode === "register" && firebaseConfigured ? (
              <AdminField label="Full name">
                <input
                  name="displayName"
                  onChange={(event) => setDisplayName(event.target.value)}
                  placeholder="Your full name"
                  type="text"
                  value={displayName}
                />
              </AdminField>
            ) : null}
            <AdminField label="Email">
              <input
                name="email"
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                value={email}
              />
            </AdminField>
            <AdminField label="Password">
              <input
                name="password"
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                value={password}
              />
            </AdminField>
            {mode === "register" && firebaseConfigured ? (
              <AdminField label="Confirm password">
                <input
                  name="confirmPassword"
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  type="password"
                  value={confirmPassword}
                />
              </AdminField>
            ) : null}
            <button className="cta-button" disabled={isPending} type="submit">
              {isPending
                ? mode === "register"
                  ? "Creating account..."
                  : "Signing in..."
                : mode === "register"
                  ? "Create Account"
                  : "Login"}
            </button>
            {firebaseConfigured && mode === "signin" ? (
              <button
                className="ghost-button"
                disabled={isPending || !email}
                onClick={handlePasswordReset}
                type="button"
              >
                Send password reset
              </button>
            ) : null}
            {infoMessage ? <p className="form-status form-status--success">{infoMessage}</p> : null}
            {errorMessage ? <p className="form-status form-status--error">{errorMessage}</p> : null}
          </form>
        </div>
      </section>
    </div>
  );
}

export function AdminPageContent() {
  const {
    contactMessages,
    content,
    isAdmin,
    isReady,
    registrations,
    restoreSeedContent,
    session,
    updateContent,
    uploadImage,
    logout,
  } = useStudio();
  const router = useRouter();
  const [draft, setDraft] = useState<StudioContent>(content);
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [saveMessage, setSaveMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setDraft(content);
  }, [content]);

  if (!isReady) {
    return (
      <div className="page-shell">
        <section className="locked-panel reveal">
          <h1>Loading studio management</h1>
          <p>Please wait a moment.</p>
        </section>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="page-shell">
        <section className="locked-panel reveal">
          <h1>Studio management is restricted</h1>
          <p>Please sign in with a studio management account to continue.</p>
          <Link className="cta-button" href="/login">
            Go to sign in
          </Link>
        </section>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="page-shell">
        <section className="locked-panel reveal">
          <h1>Studio management is restricted</h1>
          <p>This account does not currently have access to studio management.</p>
          <Link className="cta-button" href="/booking">
            Back to classes
          </Link>
        </section>
      </div>
    );
  }

  function setStyleOffering(index: number, nextStyle: StyleOffering) {
    setDraft((current) => ({
      ...current,
      styleOfferings: updateItem(current.styleOfferings, index, () => nextStyle),
    }));
  }

  function setScheduleDay(index: number, nextDay: ScheduleDay) {
    setDraft((current) => ({
      ...current,
      schedule: updateItem(current.schedule, index, () => nextDay),
    }));
  }

  function setInstructor(index: number, nextInstructor: InstructorProfile) {
    setDraft((current) => ({
      ...current,
      instructors: updateItem(current.instructors, index, () => nextInstructor),
    }));
  }

  function setEvent(index: number, nextEvent: EventPost) {
    setDraft((current) => ({
      ...current,
      events: updateItem(current.events, index, () => nextEvent),
    }));
  }

  function setGalleryItem(index: number, nextItem: GalleryItem) {
    setDraft((current) => ({
      ...current,
      gallery: updateItem(current.gallery, index, () => nextItem),
    }));
  }

  function setPackage(index: number, nextPackage: PackageOption) {
    setDraft((current) => ({
      ...current,
      packages: updateItem(current.packages, index, () => nextPackage),
    }));
  }

  function handleSave() {
    startTransition(async () => {
      try {
        await updateContent(draft);
        setSaveMessage("Changes saved.");
      } catch (error) {
        setSaveMessage(error instanceof Error ? error.message : "Unable to save changes.");
      }
    });
  }

  function handleRestoreSeed() {
    startTransition(async () => {
      try {
        await restoreSeedContent();
        setDraft(seedStudioContent);
        setSaveMessage("Studio content restored.");
      } catch (error) {
        setSaveMessage(error instanceof Error ? error.message : "Unable to restore defaults.");
      }
    });
  }

  async function setUploadedImage(
    onComplete: (imageUrl: string) => void,
    file: File
  ) {
    const nextImage = await uploadImage(file);
    onComplete(nextImage);
  }

  return (
    <div className="page-shell">
      <section className="admin-shell reveal">
        <div className="admin-topbar">
          <div>
            <span className="hero-eyebrow">Studio Management</span>
            <h1>Manage classes, imagery, updates, and contact details.</h1>
            <p>Keep the studio presence current across every major section.</p>
          </div>
          <div className="admin-topbar__actions">
            <button className="cta-button" disabled={isPending} onClick={handleSave} type="button">
              {isPending ? "Saving..." : "Save Changes"}
            </button>
            <button className="ghost-button" onClick={handleRestoreSeed} type="button">
              Restore Defaults
            </button>
            <button
              className="ghost-button"
              onClick={() => {
                void logout().then(() => {
                  router.push("/");
                });
              }}
              type="button"
            >
              Log Out
            </button>
          </div>
        </div>
        {saveMessage ? <p className="admin-save-message">{saveMessage}</p> : null}
        <div className="admin-tabbar">
          <TabButton active={activeTab === "overview"} label="Overview" onClick={() => setActiveTab("overview")} />
          <TabButton active={activeTab === "styles"} label="Styles" onClick={() => setActiveTab("styles")} />
          <TabButton active={activeTab === "schedule"} label="Schedule" onClick={() => setActiveTab("schedule")} />
          <TabButton active={activeTab === "team"} label="Team" onClick={() => setActiveTab("team")} />
          <TabButton active={activeTab === "events"} label="Events" onClick={() => setActiveTab("events")} />
          <TabButton active={activeTab === "gallery"} label="Gallery" onClick={() => setActiveTab("gallery")} />
          <TabButton active={activeTab === "studio"} label="Studio Info" onClick={() => setActiveTab("studio")} />
          <TabButton active={activeTab === "inbox"} label="Messages" onClick={() => setActiveTab("inbox")} />
        </div>

        {activeTab === "overview" ? (
          <div className="admin-grid">
            <AdminSectionCard title="Hero content">
              <AdminField label="Eyebrow">
                <AdminTextInput
                  value={draft.hero.eyebrow}
                  onChange={(value) =>
                    setDraft((current) => ({
                      ...current,
                      hero: { ...current.hero, eyebrow: value },
                    }))
                  }
                />
              </AdminField>
              <AdminField label="Hero title">
                <AdminTextInput
                  value={draft.hero.title}
                  onChange={(value) =>
                    setDraft((current) => ({
                      ...current,
                      hero: { ...current.hero, title: value },
                    }))
                  }
                />
              </AdminField>
              <AdminField label="Hero subtitle">
                <AdminTextArea
                  value={draft.hero.subtitle}
                  onChange={(value) =>
                    setDraft((current) => ({
                      ...current,
                      hero: { ...current.hero, subtitle: value },
                    }))
                  }
                />
              </AdminField>
              <AdminField label="Primary button label">
                <AdminTextInput
                  value={draft.hero.primaryAction.label}
                  onChange={(value) =>
                    setDraft((current) => ({
                      ...current,
                      hero: {
                        ...current.hero,
                        primaryAction: { ...current.hero.primaryAction, label: value },
                      },
                    }))
                  }
                />
              </AdminField>
              <AdminField label="Primary button link">
                <AdminTextInput
                  value={draft.hero.primaryAction.href}
                  onChange={(value) =>
                    setDraft((current) => ({
                      ...current,
                      hero: {
                        ...current.hero,
                        primaryAction: { ...current.hero.primaryAction, href: value },
                      },
                    }))
                  }
                />
              </AdminField>
              <AdminField label="Secondary button label">
                <AdminTextInput
                  value={draft.hero.secondaryAction.label}
                  onChange={(value) =>
                    setDraft((current) => ({
                      ...current,
                      hero: {
                        ...current.hero,
                        secondaryAction: { ...current.hero.secondaryAction, label: value },
                      },
                    }))
                  }
                />
              </AdminField>
              <AdminField label="Secondary button link">
                <AdminTextInput
                  value={draft.hero.secondaryAction.href}
                  onChange={(value) =>
                    setDraft((current) => ({
                      ...current,
                      hero: {
                        ...current.hero,
                        secondaryAction: { ...current.hero.secondaryAction, href: value },
                      },
                    }))
                  }
                />
              </AdminField>
              <ImageUploadField
                label="Hero background image"
                image={draft.hero.backgroundImage}
                onChange={(value) =>
                  setDraft((current) => ({
                    ...current,
                    hero: { ...current.hero, backgroundImage: value },
                  }))
                }
                onUpload={(file) =>
                  setUploadedImage(
                    (imageUrl) =>
                      setDraft((current) => ({
                        ...current,
                        hero: { ...current.hero, backgroundImage: imageUrl },
                      })),
                    file
                  )
                }
              />
              <ImageUploadField
                label="Hero spotlight image"
                image={draft.hero.spotlightImage}
                onChange={(value) =>
                  setDraft((current) => ({
                    ...current,
                    hero: { ...current.hero, spotlightImage: value },
                  }))
                }
                onUpload={(file) =>
                  setUploadedImage(
                    (imageUrl) =>
                      setDraft((current) => ({
                        ...current,
                        hero: { ...current.hero, spotlightImage: imageUrl },
                      })),
                    file
                  )
                }
              />
              <AdminField label="Floating note 1">
                <AdminTextInput
                  value={draft.hero.notes[0] ?? ""}
                  onChange={(value) =>
                    setDraft((current) => ({
                      ...current,
                      hero: { ...current.hero, notes: [value, current.hero.notes[1] ?? ""] },
                    }))
                  }
                />
              </AdminField>
              <AdminField label="Floating note 2">
                <AdminTextInput
                  value={draft.hero.notes[1] ?? ""}
                  onChange={(value) =>
                    setDraft((current) => ({
                      ...current,
                      hero: { ...current.hero, notes: [current.hero.notes[0] ?? "", value] },
                    }))
                  }
                />
              </AdminField>
            </AdminSectionCard>

            <AdminSectionCard title="Summit feature">
              <AdminField label="Label">
                <AdminTextInput
                  value={draft.summitFeature.label}
                  onChange={(value) =>
                    setDraft((current) => ({
                      ...current,
                      summitFeature: { ...current.summitFeature, label: value },
                    }))
                  }
                />
              </AdminField>
              <AdminField label="Title">
                <AdminTextInput
                  value={draft.summitFeature.title}
                  onChange={(value) =>
                    setDraft((current) => ({
                      ...current,
                      summitFeature: { ...current.summitFeature, title: value },
                    }))
                  }
                />
              </AdminField>
              <AdminField label="Description">
                <AdminTextArea
                  value={draft.summitFeature.description}
                  onChange={(value) =>
                    setDraft((current) => ({
                      ...current,
                      summitFeature: { ...current.summitFeature, description: value },
                    }))
                  }
                />
              </AdminField>
              <AdminField label="Detail copy">
                <AdminTextArea
                  value={draft.summitFeature.detail}
                  onChange={(value) =>
                    setDraft((current) => ({
                      ...current,
                      summitFeature: { ...current.summitFeature, detail: value },
                    }))
                  }
                />
              </AdminField>
              <AdminField label="CTA label">
                <AdminTextInput
                  value={draft.summitFeature.action.label}
                  onChange={(value) =>
                    setDraft((current) => ({
                      ...current,
                      summitFeature: {
                        ...current.summitFeature,
                        action: { ...current.summitFeature.action, label: value },
                      },
                    }))
                  }
                />
              </AdminField>
              <AdminField label="CTA link">
                <AdminTextInput
                  value={draft.summitFeature.action.href}
                  onChange={(value) =>
                    setDraft((current) => ({
                      ...current,
                      summitFeature: {
                        ...current.summitFeature,
                        action: { ...current.summitFeature.action, href: value },
                      },
                    }))
                  }
                />
              </AdminField>
            </AdminSectionCard>
          </div>
        ) : null}

        {activeTab === "styles" ? (
          <div className="admin-stack">
            <button
              className="ghost-button"
              onClick={() =>
                setDraft((current) => ({
                  ...current,
                  styleOfferings: [
                    ...current.styleOfferings,
                    {
                      name: "New style",
                      summary: "Describe the class energy and focus.",
                      audience: "Best for: who this class serves",
                      image: current.hero.spotlightImage,
                      highlights: ["Highlight one", "Highlight two", "Highlight three"],
                    },
                  ],
                }))
              }
              type="button"
            >
              Add Style
            </button>
            {draft.styleOfferings.map((style, index) => (
              <AdminSectionCard
                key={`${style.name}-${index}`}
                title={`Style ${index + 1}`}
                action={
                  <button
                    className="text-button"
                    onClick={() =>
                      setDraft((current) => ({
                        ...current,
                        styleOfferings: current.styleOfferings.filter(
                          (_, itemIndex) => itemIndex !== index
                        ),
                      }))
                    }
                    type="button"
                  >
                    Remove
                  </button>
                }
              >
                <AdminField label="Name">
                  <AdminTextInput
                    value={style.name}
                    onChange={(value) => setStyleOffering(index, { ...style, name: value })}
                  />
                </AdminField>
                <AdminField label="Summary">
                  <AdminTextArea
                    value={style.summary}
                    onChange={(value) => setStyleOffering(index, { ...style, summary: value })}
                  />
                </AdminField>
                <AdminField label="Audience line">
                  <AdminTextInput
                    value={style.audience}
                    onChange={(value) => setStyleOffering(index, { ...style, audience: value })}
                  />
                </AdminField>
                <AdminField label="Highlights (one per line)">
                  <AdminTextArea
                    rows={5}
                    value={listToLines(style.highlights)}
                    onChange={(value) =>
                      setStyleOffering(index, {
                        ...style,
                        highlights: linesToList(value),
                      })
                    }
                  />
                </AdminField>
                <ImageUploadField
                  label="Image"
                  image={style.image}
                  onChange={(value) => setStyleOffering(index, { ...style, image: value })}
                  onUpload={(file) =>
                    setUploadedImage(
                      (imageUrl) => setStyleOffering(index, { ...style, image: imageUrl }),
                      file
                    )
                  }
                />
              </AdminSectionCard>
            ))}
          </div>
        ) : null}

        {activeTab === "schedule" ? (
          <div className="admin-stack">
            <button
              className="ghost-button"
              onClick={() =>
                setDraft((current) => ({
                  ...current,
                  schedule: [
                    ...current.schedule,
                    {
                      day: "New day",
                      sessions: [
                        {
                          time: "6:00 PM",
                          style: "New class",
                          group: "Open",
                          level: "All levels",
                          instructor: "Instructor",
                        },
                      ],
                    },
                  ],
                }))
              }
              type="button"
            >
              Add Day
            </button>
            {draft.schedule.map((day, dayIndex) => (
              <AdminSectionCard
                key={`${day.day}-${dayIndex}`}
                title={`Schedule: ${day.day}`}
                action={
                  <button
                    className="text-button"
                    onClick={() =>
                      setDraft((current) => ({
                        ...current,
                        schedule: current.schedule.filter(
                          (_, itemIndex) => itemIndex !== dayIndex
                        ),
                      }))
                    }
                    type="button"
                  >
                    Remove day
                  </button>
                }
              >
                <AdminField label="Day">
                  <AdminTextInput
                    value={day.day}
                    onChange={(value) => setScheduleDay(dayIndex, { ...day, day: value })}
                  />
                </AdminField>
                <div className="admin-stack">
                  {day.sessions.map((session, sessionIndex) => (
                    <div className="admin-inline-card" key={`${session.time}-${session.style}-${sessionIndex}`}>
                      <div className="admin-inline-card__header">
                        <strong>Session {sessionIndex + 1}</strong>
                        <button
                          className="text-button"
                          onClick={() =>
                            setScheduleDay(dayIndex, {
                              ...day,
                              sessions: day.sessions.filter((_, index) => index !== sessionIndex),
                            })
                          }
                          type="button"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="admin-two-column">
                        <AdminField label="Time">
                          <AdminTextInput
                            value={session.time}
                            onChange={(value) =>
                              setScheduleDay(dayIndex, {
                                ...day,
                                sessions: updateItem(day.sessions, sessionIndex, (currentSession) => ({
                                  ...currentSession,
                                  time: value,
                                })),
                              })
                            }
                          />
                        </AdminField>
                        <AdminField label="Style">
                          <AdminTextInput
                            value={session.style}
                            onChange={(value) =>
                              setScheduleDay(dayIndex, {
                                ...day,
                                sessions: updateItem(day.sessions, sessionIndex, (currentSession) => ({
                                  ...currentSession,
                                  style: value,
                                })),
                              })
                            }
                          />
                        </AdminField>
                        <AdminField label="Group">
                          <AdminTextInput
                            value={session.group}
                            onChange={(value) =>
                              setScheduleDay(dayIndex, {
                                ...day,
                                sessions: updateItem(day.sessions, sessionIndex, (currentSession) => ({
                                  ...currentSession,
                                  group: value,
                                })),
                              })
                            }
                          />
                        </AdminField>
                        <AdminField label="Level">
                          <AdminTextInput
                            value={session.level}
                            onChange={(value) =>
                              setScheduleDay(dayIndex, {
                                ...day,
                                sessions: updateItem(day.sessions, sessionIndex, (currentSession) => ({
                                  ...currentSession,
                                  level: value,
                                })),
                              })
                            }
                          />
                        </AdminField>
                        <AdminField label="Instructor">
                          <AdminTextInput
                            value={session.instructor}
                            onChange={(value) =>
                              setScheduleDay(dayIndex, {
                                ...day,
                                sessions: updateItem(day.sessions, sessionIndex, (currentSession) => ({
                                  ...currentSession,
                                  instructor: value,
                                })),
                              })
                            }
                          />
                        </AdminField>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  className="ghost-button"
                  onClick={() =>
                    setScheduleDay(dayIndex, {
                      ...day,
                      sessions: [
                        ...day.sessions,
                        {
                          time: "6:00 PM",
                          style: "New class",
                          group: "Open",
                          level: "All levels",
                          instructor: "Instructor",
                        },
                      ],
                    })
                  }
                  type="button"
                >
                  Add Session
                </button>
              </AdminSectionCard>
            ))}
          </div>
        ) : null}

        {activeTab === "team" ? (
          <div className="admin-stack">
            <button
              className="ghost-button"
              onClick={() =>
                setDraft((current) => ({
                  ...current,
                  instructors: [
                    ...current.instructors,
                    {
                      name: "New instructor",
                      role: "Instructor",
                      specialties: "Specialties",
                      bio: "Add a short faculty biography.",
                      image: current.hero.spotlightImage,
                    },
                  ],
                }))
              }
              type="button"
            >
              Add Instructor
            </button>
            {draft.instructors.map((instructor, index) => (
              <AdminSectionCard
                key={`${instructor.name}-${index}`}
                title={`Instructor ${index + 1}`}
                action={
                  <button
                    className="text-button"
                    onClick={() =>
                      setDraft((current) => ({
                        ...current,
                        instructors: current.instructors.filter(
                          (_, itemIndex) => itemIndex !== index
                        ),
                      }))
                    }
                    type="button"
                  >
                    Remove
                  </button>
                }
              >
                <AdminField label="Name">
                  <AdminTextInput
                    value={instructor.name}
                    onChange={(value) => setInstructor(index, { ...instructor, name: value })}
                  />
                </AdminField>
                <AdminField label="Role">
                  <AdminTextInput
                    value={instructor.role}
                    onChange={(value) => setInstructor(index, { ...instructor, role: value })}
                  />
                </AdminField>
                <AdminField label="Specialties">
                  <AdminTextInput
                    value={instructor.specialties}
                    onChange={(value) =>
                      setInstructor(index, { ...instructor, specialties: value })
                    }
                  />
                </AdminField>
                <AdminField label="Bio">
                  <AdminTextArea
                    value={instructor.bio}
                    onChange={(value) => setInstructor(index, { ...instructor, bio: value })}
                  />
                </AdminField>
                <ImageUploadField
                  label="Image"
                  image={instructor.image}
                  onChange={(value) => setInstructor(index, { ...instructor, image: value })}
                  onUpload={(file) =>
                    setUploadedImage(
                      (imageUrl) => setInstructor(index, { ...instructor, image: imageUrl }),
                      file
                    )
                  }
                />
              </AdminSectionCard>
            ))}
          </div>
        ) : null}

        {activeTab === "events" ? (
          <div className="admin-stack">
            <button
              className="ghost-button"
              onClick={() =>
                setDraft((current) => ({
                  ...current,
                  events: [
                    ...current.events,
                    {
                      title: "New post",
                      date: "Coming soon",
                      location: "Studio update",
                      summary: "Add a short summary of the post or event update.",
                      image: current.hero.backgroundImage,
                      ctaLabel: "Learn more",
                      ctaHref: "/contact",
                    },
                  ],
                }))
              }
              type="button"
            >
              Add Post
            </button>
            {draft.events.map((event, index) => (
              <AdminSectionCard
                key={`${event.title}-${index}`}
                title={`Event ${index + 1}`}
                action={
                  <button
                    className="text-button"
                    onClick={() =>
                      setDraft((current) => ({
                        ...current,
                        events: current.events.filter((_, itemIndex) => itemIndex !== index),
                      }))
                    }
                    type="button"
                  >
                    Remove
                  </button>
                }
              >
                <AdminField label="Title">
                  <AdminTextInput
                    value={event.title}
                    onChange={(value) => setEvent(index, { ...event, title: value })}
                  />
                </AdminField>
                <div className="admin-two-column">
                  <AdminField label="Date">
                    <AdminTextInput
                      value={event.date}
                      onChange={(value) => setEvent(index, { ...event, date: value })}
                    />
                  </AdminField>
                  <AdminField label="Location">
                    <AdminTextInput
                      value={event.location}
                      onChange={(value) => setEvent(index, { ...event, location: value })}
                    />
                  </AdminField>
                </div>
                <AdminField label="Summary">
                  <AdminTextArea
                    value={event.summary}
                    onChange={(value) => setEvent(index, { ...event, summary: value })}
                  />
                </AdminField>
                <div className="admin-two-column">
                  <AdminField label="CTA label">
                    <AdminTextInput
                      value={event.ctaLabel}
                      onChange={(value) => setEvent(index, { ...event, ctaLabel: value })}
                    />
                  </AdminField>
                  <AdminField label="CTA link">
                    <AdminTextInput
                      value={event.ctaHref}
                      onChange={(value) => setEvent(index, { ...event, ctaHref: value })}
                    />
                  </AdminField>
                </div>
                <ImageUploadField
                  label="Image"
                  image={event.image}
                  onChange={(value) => setEvent(index, { ...event, image: value })}
                  onUpload={(file) =>
                    setUploadedImage(
                      (imageUrl) => setEvent(index, { ...event, image: imageUrl }),
                      file
                    )
                  }
                />
              </AdminSectionCard>
            ))}
          </div>
        ) : null}

        {activeTab === "gallery" ? (
          <div className="admin-stack">
            <button
              className="ghost-button"
              onClick={() =>
                setDraft((current) => ({
                  ...current,
                  gallery: [
                    ...current.gallery,
                    {
                      title: "New gallery item",
                      category: "Category",
                      image: current.hero.backgroundImage,
                    },
                  ],
                }))
              }
              type="button"
            >
              Add Gallery Item
            </button>
            {draft.gallery.map((item, index) => (
              <AdminSectionCard
                key={`${item.title}-${index}`}
                title={`Gallery item ${index + 1}`}
                action={
                  <button
                    className="text-button"
                    onClick={() =>
                      setDraft((current) => ({
                        ...current,
                        gallery: current.gallery.filter((_, itemIndex) => itemIndex !== index),
                      }))
                    }
                    type="button"
                  >
                    Remove
                  </button>
                }
              >
                <AdminField label="Title">
                  <AdminTextInput
                    value={item.title}
                    onChange={(value) => setGalleryItem(index, { ...item, title: value })}
                  />
                </AdminField>
                <AdminField label="Category">
                  <AdminTextInput
                    value={item.category}
                    onChange={(value) => setGalleryItem(index, { ...item, category: value })}
                  />
                </AdminField>
                <ImageUploadField
                  label="Image"
                  image={item.image}
                  onChange={(value) => setGalleryItem(index, { ...item, image: value })}
                  onUpload={(file) =>
                    setUploadedImage(
                      (imageUrl) => setGalleryItem(index, { ...item, image: imageUrl }),
                      file
                    )
                  }
                />
              </AdminSectionCard>
            ))}
          </div>
        ) : null}

        {activeTab === "studio" ? (
          <div className="admin-grid">
            <AdminSectionCard title="Packages">
              <button
                className="ghost-button"
                onClick={() =>
                  setDraft((current) => ({
                    ...current,
                    packages: [
                      ...current.packages,
                      {
                        name: "New package",
                        price: "$0",
                        summary: "Short package summary",
                        perks: ["Perk one", "Perk two"],
                      },
                    ],
                  }))
                }
                type="button"
              >
                Add Package
              </button>
              {draft.packages.map((option, index) => (
                <div className="admin-inline-card" key={`${option.name}-${index}`}>
                  <div className="admin-inline-card__header">
                    <strong>Package {index + 1}</strong>
                    <button
                      className="text-button"
                      onClick={() =>
                        setDraft((current) => ({
                          ...current,
                          packages: current.packages.filter(
                            (_, itemIndex) => itemIndex !== index
                          ),
                        }))
                      }
                      type="button"
                    >
                      Remove
                    </button>
                  </div>
                  <AdminField label="Name">
                    <AdminTextInput
                      value={option.name}
                      onChange={(value) => setPackage(index, { ...option, name: value })}
                    />
                  </AdminField>
                  <div className="admin-two-column">
                    <AdminField label="Price">
                      <AdminTextInput
                        value={option.price}
                        onChange={(value) => setPackage(index, { ...option, price: value })}
                      />
                    </AdminField>
                    <AdminField label="Summary">
                      <AdminTextInput
                        value={option.summary}
                        onChange={(value) => setPackage(index, { ...option, summary: value })}
                      />
                    </AdminField>
                  </div>
                  <AdminField label="Perks (one per line)">
                    <AdminTextArea
                      value={listToLines(option.perks)}
                      onChange={(value) =>
                        setPackage(index, { ...option, perks: linesToList(value) })
                      }
                    />
                  </AdminField>
                </div>
              ))}
            </AdminSectionCard>
            <AdminSectionCard title="Contact details">
              <AdminField label="Email">
                <AdminTextInput
                  value={draft.contact.email}
                  onChange={(value) =>
                    setDraft((current) => ({
                      ...current,
                      contact: { ...current.contact, email: value },
                    }))
                  }
                />
              </AdminField>
              <AdminField label="Phone">
                <AdminTextInput
                  value={draft.contact.phone}
                  onChange={(value) =>
                    setDraft((current) => ({
                      ...current,
                      contact: { ...current.contact, phone: value },
                    }))
                  }
                />
              </AdminField>
              <AdminField label="Instagram">
                <AdminTextInput
                  value={draft.contact.instagram}
                  onChange={(value) =>
                    setDraft((current) => ({
                      ...current,
                      contact: { ...current.contact, instagram: value },
                    }))
                  }
                />
              </AdminField>
              <AdminField label="YouTube">
                <AdminTextInput
                  value={draft.contact.youtube}
                  onChange={(value) =>
                    setDraft((current) => ({
                      ...current,
                      contact: { ...current.contact, youtube: value },
                    }))
                  }
                />
              </AdminField>
              <AdminField label="WhatsApp">
                <AdminTextInput
                  value={draft.contact.whatsapp}
                  onChange={(value) =>
                    setDraft((current) => ({
                      ...current,
                      contact: { ...current.contact, whatsapp: value },
                    }))
                  }
                />
              </AdminField>
              <AdminField label="Service area">
                <AdminTextArea
                  value={draft.contact.serviceArea}
                  onChange={(value) =>
                    setDraft((current) => ({
                      ...current,
                      contact: { ...current.contact, serviceArea: value },
                    }))
                  }
                />
              </AdminField>
              <AdminField label="Response time">
                <AdminTextInput
                  value={draft.contact.responseTime}
                  onChange={(value) =>
                    setDraft((current) => ({
                      ...current,
                      contact: { ...current.contact, responseTime: value },
                    }))
                  }
                />
              </AdminField>
            </AdminSectionCard>
          </div>
        ) : null}

        {activeTab === "inbox" ? (
          <div className="admin-grid">
            <AdminSectionCard title={`Registrations (${registrations.length})`}>
              <div className="inbox-list">
                {registrations.length ? (
                  registrations.map((registration) => (
                    <article className="inbox-card" key={registration.id}>
                      <strong>{registration.name}</strong>
                      <p>
                        {registration.styleInterest} · {registration.dancerAge} · {registration.experience}
                      </p>
                      <p>{registration.email}</p>
                      <p>{registration.phone}</p>
                      <small>{registration.note || "No note added."}</small>
                    </article>
                  ))
                ) : (
                  <p className="empty-state">No registrations yet.</p>
                )}
              </div>
            </AdminSectionCard>
            <AdminSectionCard title={`Messages (${contactMessages.length})`}>
              <div className="inbox-list">
                {contactMessages.length ? (
                  contactMessages.map((message) => (
                    <article className="inbox-card" key={message.id}>
                      <strong>{message.name}</strong>
                      <p>{message.inquiryType}</p>
                      <p>{message.email}</p>
                      <p>{message.phone || "No phone shared."}</p>
                      <small>{message.message}</small>
                    </article>
                  ))
                ) : (
                  <p className="empty-state">No contact messages yet.</p>
                )}
              </div>
            </AdminSectionCard>
          </div>
        ) : null}
      </section>
    </div>
  );
}

export function LogoutPageContent() {
  const { logout } = useStudio();
  const router = useRouter();

  useEffect(() => {
    void logout().then(() => {
      router.replace("/");
    });
  }, [logout, router]);

  return (
    <div className="page-shell">
      <section className="locked-panel reveal">
        <h1>Signing out</h1>
        <p>See you again soon.</p>
      </section>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import Script from "next/script";
import { useCallback, useEffect, useId, useRef, useState } from "react";

import { Button } from "@/components/ui/Button";
import { EmergencyNotice } from "@/components/ui/EmergencyNotice";
import { resolveFieldMessage } from "@/lib/inquiry-errors";
import { inquirySchema } from "@/lib/schemas/inquiry";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/locales";
import { cn } from "@/lib/utils";

type InquiryCopy = Dictionary["inquiry"];

type FieldName = "firstName" | "lastName" | "email" | "phone" | "subject" | "message";

const initialValues: Record<FieldName, string> = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

const TURNSTILE_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

export function InquiryForm({
  locale,
  copy,
  thankYouPath,
  siteKey,
}: {
  locale: Locale;
  copy: InquiryCopy;
  thankYouPath: string;
  siteKey: string;
}) {
  const router = useRouter();
  const form = copy.form;
  const messages = form.errors;

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [token, setToken] = useState("");

  const submittingRef = useRef(false);
  const summaryRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);

  const baseId = useId();
  const fieldId = (name: string) => `${baseId}-${name}`;
  const errorId = (name: string) => `${baseId}-${name}-error`;

  // --- Turnstile ---------------------------------------------------------
  const renderWidget = useCallback(() => {
    if (!window.turnstile || !widgetRef.current || widgetIdRef.current || !siteKey) return;
    widgetIdRef.current = window.turnstile.render(widgetRef.current, {
      sitekey: siteKey,
      language: locale,
      theme: "auto",
      callback: (t) => setToken(t),
      "expired-callback": () => setToken(""),
      "error-callback": () => setToken(""),
    });
  }, [locale, siteKey]);

  useEffect(() => {
    renderWidget();
  }, [renderWidget]);

  const resetTurnstile = useCallback(() => {
    setToken("");
    if (window.turnstile && widgetIdRef.current) {
      window.turnstile.reset(widgetIdRef.current);
    }
  }, []);

  // --- Helpers -----------------------------------------------------------
  function setField(name: FieldName, value: string) {
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: undefined }));
  }

  function focusSummary() {
    // Defer so the alert exists before focusing.
    requestAnimationFrame(() => summaryRef.current?.focus());
  }

  function applyFieldErrors(fieldErrors: Record<string, string>) {
    const mapped: Partial<Record<FieldName, string>> = {};
    for (const [field, code] of Object.entries(fieldErrors)) {
      if (field in initialValues) {
        mapped[field as FieldName] = resolveFieldMessage(field, code, messages);
      }
    }
    setErrors(mapped);
    const first = (Object.keys(mapped) as FieldName[])[0];
    if (first) {
      requestAnimationFrame(() => document.getElementById(fieldId(first))?.focus());
    } else {
      focusSummary();
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submittingRef.current) return;
    setFormError(null);

    // Client-side validation for immediate feedback. The honeypot value is read
    // from the DOM (not hardcoded) so a bot that fills the hidden field is
    // caught both here and on the server.
    const candidate = {
      ...values,
      company: honeypotRef.current?.value ?? "",
      turnstileToken: token,
    };
    const parsed = inquirySchema.safeParse(candidate);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        if (typeof field === "string" && !fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }
      // A missing token surfaces as a form-level captcha notice.
      if (fieldErrors.turnstileToken && Object.keys(fieldErrors).length === 1) {
        setFormError(messages.captcha);
        focusSummary();
        return;
      }
      applyFieldErrors(fieldErrors);
      return;
    }

    submittingRef.current = true;
    setSubmitting(true);

    try {
      const response = await fetch(
        `/api/inquiry?locale=${encodeURIComponent(locale)}`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(candidate),
        },
      );

      if (response.ok) {
        // Navigate to the localized thank-you page (keeps submitting state).
        router.push(thankYouPath);
        return;
      }

      const result = (await response.json().catch(() => ({}))) as {
        error?: string;
        fieldErrors?: Record<string, string>;
        retryAfter?: number;
      };

      resetTurnstile();

      if (response.status === 422 && result.fieldErrors) {
        applyFieldErrors(result.fieldErrors);
      } else if (response.status === 429) {
        setFormError(messages.rateLimit.replace("{seconds}", String(result.retryAfter ?? 60)));
        focusSummary();
      } else if (result.error === "captcha") {
        setFormError(messages.captcha);
        focusSummary();
      } else {
        setFormError(messages.server);
        focusSummary();
      }
    } catch {
      resetTurnstile();
      setFormError(messages.network);
      focusSummary();
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  }

  const hasErrors = formError !== null || Object.values(errors).some(Boolean);

  return (
    <>
      <Script src={TURNSTILE_SRC} strategy="afterInteractive" onLoad={renderWidget} />

      <EmergencyNotice message={copy.emergencyNotice} className="mb-6" />

      <form noValidate onSubmit={onSubmit} aria-busy={submitting}>
        {/* Form-level error summary (live region). */}
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          aria-live="assertive"
          className={cn(
            "mb-4 rounded-md border border-danger/40 bg-danger/5 p-4 text-sm text-danger",
            !hasErrors && "hidden",
          )}
        >
          {formError ?? form.errorSummaryTitle}
        </div>

        <p className="mb-4 text-sm text-muted">{form.requiredHint}</p>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <TextField
            id={fieldId("firstName")}
            errorId={errorId("firstName")}
            label={form.firstName}
            required
            autoComplete="given-name"
            value={values.firstName}
            error={errors.firstName}
            onChange={(v) => setField("firstName", v)}
          />
          <TextField
            id={fieldId("lastName")}
            errorId={errorId("lastName")}
            label={form.lastName}
            required
            autoComplete="family-name"
            value={values.lastName}
            error={errors.lastName}
            onChange={(v) => setField("lastName", v)}
          />
          <TextField
            id={fieldId("email")}
            errorId={errorId("email")}
            label={form.email}
            required
            type="email"
            inputMode="email"
            autoComplete="email"
            value={values.email}
            error={errors.email}
            onChange={(v) => setField("email", v)}
          />
          <TextField
            id={fieldId("phone")}
            errorId={errorId("phone")}
            label={form.phone}
            optionalLabel={form.optional}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={values.phone}
            error={errors.phone}
            onChange={(v) => setField("phone", v)}
          />
          <div className="min-w-0 sm:col-span-2">
            <TextField
              id={fieldId("subject")}
              errorId={errorId("subject")}
              label={form.subject}
              optionalLabel={form.optional}
              autoComplete="off"
              value={values.subject}
              error={errors.subject}
              onChange={(v) => setField("subject", v)}
            />
          </div>
          <div className="min-w-0 sm:col-span-2">
            <Field
              id={fieldId("message")}
              errorId={errorId("message")}
              label={form.message}
              required
              hint={form.messageHint}
              hintId={`${baseId}-message-hint`}
              error={errors.message}
            >
              <textarea
                id={fieldId("message")}
                name="message"
                required
                rows={5}
                value={values.message}
                aria-invalid={errors.message ? true : undefined}
                aria-describedby={cn(
                  `${baseId}-message-hint`,
                  errors.message && errorId("message"),
                )}
                onChange={(e) => setField("message", e.target.value)}
                className={inputClass(Boolean(errors.message))}
              />
            </Field>
          </div>
        </div>

        {/* Honeypot: must remain empty. Hidden from users and assistive tech. */}
        <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
          <label htmlFor={fieldId("company")}>Company</label>
          <input
            ref={honeypotRef}
            id={fieldId("company")}
            name="company"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            defaultValue=""
          />
        </div>

        {/* Turnstile widget */}
        <div className="mt-6">
          <span className="sr-only">{form.turnstileLabel}</span>
          <div ref={widgetRef} />
        </div>

        <div className="mt-6">
          <Button type="submit" size="lg" disabled={submitting} className="w-full sm:w-auto">
            {submitting ? form.submitting : form.submit}
          </Button>
          <p className="mt-3 text-sm text-muted">{form.privacyNote}</p>
        </div>
      </form>
    </>
  );
}

// --- Field primitives ----------------------------------------------------

function inputClass(hasError: boolean): string {
  return cn(
    // 16px text avoids iOS auto-zoom; 44px min height for touch.
    "block w-full rounded-md border bg-surface px-3 py-2.5 text-base text-ink",
    "min-h-11 placeholder:text-muted focus-visible:outline-3 focus-visible:outline-offset-2",
    hasError ? "border-danger" : "border-line",
  );
}

function Field({
  id,
  errorId,
  label,
  required,
  optionalLabel,
  hint,
  hintId,
  error,
  children,
}: {
  id: string;
  errorId: string;
  label: string;
  required?: boolean;
  optionalLabel?: string;
  hint?: string;
  hintId?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
        {required ? (
          <span className="text-danger"> *</span>
        ) : optionalLabel ? (
          <span className="font-normal text-muted"> ({optionalLabel})</span>
        ) : null}
      </label>
      {hint && hintId ? (
        <p id={hintId} className="mb-1.5 text-sm text-muted">
          {hint}
        </p>
      ) : null}
      {children}
      {error ? (
        <p id={errorId} className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function TextField({
  id,
  errorId,
  label,
  required,
  optionalLabel,
  type = "text",
  inputMode,
  autoComplete,
  value,
  error,
  onChange,
}: {
  id: string;
  errorId: string;
  label: string;
  required?: boolean;
  optionalLabel?: string;
  type?: string;
  inputMode?: "text" | "email" | "tel";
  autoComplete?: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}) {
  return (
    <Field
      id={id}
      errorId={errorId}
      label={label}
      required={required}
      optionalLabel={optionalLabel}
      error={error}
    >
      <input
        id={id}
        name={id}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        required={required}
        value={value}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass(Boolean(error))}
      />
    </Field>
  );
}

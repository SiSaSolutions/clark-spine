import type { Locale } from "@/i18n/locales";

import type { ConfirmationProps } from "./InquiryConfirmation";
import type { OwnerNotificationProps } from "./InquiryOwnerNotification";

/**
 * Localized copy for transactional emails, kept separate from the site
 * dictionaries so templates stay self-contained and testable.
 */

type OwnerLabels = OwnerNotificationProps["labels"];
type ConfirmationLabels = ConfirmationProps["labels"];

const PHONE = "(908) 497-9440";

export const ownerLabels: Record<Locale, OwnerLabels> = {
  en: {
    preview: "New patient inquiry from the website",
    heading: "New appointment request",
    intro: "A new inquiry was submitted through the website.",
    name: "Name",
    email: "Email",
    phone: "Phone",
    subject: "Subject",
    message: "Message",
    requestId: "Reference",
    notProvided: "Not provided",
  },
  es: {
    preview: "Nueva consulta de paciente desde el sitio web",
    heading: "Nueva solicitud de cita",
    intro: "Se envió una nueva consulta a través del sitio web.",
    name: "Nombre",
    email: "Correo",
    phone: "Teléfono",
    subject: "Asunto",
    message: "Mensaje",
    requestId: "Referencia",
    notProvided: "No proporcionado",
  },
};

export const confirmationLabels: Record<Locale, ConfirmationLabels> = {
  en: {
    preview: "We received your request — Clark Spine and Pain Relief",
    heading: "We received your request",
    greeting: "Hello",
    body1:
      "Thank you for contacting Clark Spine and Pain Relief. This email confirms we received your request; our team will be in touch to follow up.",
    body2:
      "This message is a confirmation only and does not establish a doctor–patient relationship.",
    yourMessage: "Your message",
    signoff: "Warm regards,",
    practiceName: "Clark Spine and Pain Relief",
    phone: PHONE,
    emergencyNote:
      "If you are experiencing a medical emergency, call 911 or go to the nearest emergency room. Do not use email to report an emergency.",
  },
  es: {
    preview: "Recibimos su solicitud — Clark Spine and Pain Relief",
    heading: "Recibimos su solicitud",
    greeting: "Hola",
    body1:
      "Gracias por comunicarse con Clark Spine and Pain Relief. Este correo confirma que recibimos su solicitud; nuestro equipo se comunicará con usted para dar seguimiento.",
    body2:
      "Este mensaje es solo una confirmación y no establece una relación médico–paciente.",
    yourMessage: "Su mensaje",
    signoff: "Cordialmente,",
    practiceName: "Clark Spine and Pain Relief",
    phone: PHONE,
    emergencyNote:
      "Si tiene una emergencia médica, llame al 911 o acuda a la sala de emergencias más cercana. No use el correo para reportar una emergencia.",
  },
};

import { Hr, Text } from "@react-email/components";

import { EmailLayout } from "./components/EmailLayout";

export interface ConfirmationProps {
  locale: string;
  labels: {
    preview: string;
    heading: string;
    greeting: string;
    body1: string;
    body2: string;
    yourMessage: string;
    signoff: string;
    practiceName: string;
    phone: string;
    emergencyNote: string;
  };
  data: {
    firstName: string;
    message: string;
  };
}

/**
 * Patient-facing confirmation that their request was received. Sets clear,
 * non-clinical expectations and repeats the emergency guidance. Does not imply a
 * doctor–patient relationship.
 */
export function InquiryConfirmation({ locale, labels, data }: ConfirmationProps) {
  return (
    <EmailLayout locale={locale} preview={labels.preview} heading={labels.heading}>
      <Text style={p}>
        {labels.greeting} {data.firstName},
      </Text>
      <Text style={p}>{labels.body1}</Text>
      <Text style={p}>{labels.body2}</Text>
      <Hr style={hr} />
      <Text style={label}>{labels.yourMessage}:</Text>
      <Text style={quote}>{data.message}</Text>
      <Hr style={hr} />
      <Text style={emergency}>{labels.emergencyNote}</Text>
      <Text style={p}>
        {labels.signoff}
        <br />
        <strong>{labels.practiceName}</strong>
        <br />
        {labels.phone}
      </Text>
    </EmailLayout>
  );
}

const p = { color: "#16202e", fontSize: "15px", lineHeight: "1.6", margin: "12px 0" };
const label = { color: "#5a6a7e", fontSize: "14px", fontWeight: 600, margin: "0" };
const quote = {
  color: "#3a4757",
  fontSize: "14px",
  lineHeight: "1.6",
  whiteSpace: "pre-wrap" as const,
  margin: "6px 0 0",
  paddingLeft: "12px",
  borderLeft: "3px solid #b0d9ee",
};
const emergency = {
  backgroundColor: "#fff7ed",
  border: "1px solid #fed7aa",
  borderRadius: "8px",
  color: "#7c2d12",
  fontSize: "13px",
  lineHeight: "1.5",
  padding: "12px",
  margin: "12px 0",
};
const hr = { borderColor: "#e2e7ee", margin: "20px 0" };

import { Hr, Section, Text } from "@react-email/components";

import { formatUsPhone } from "@/lib/utils";
import { EmailLayout } from "./components/EmailLayout";

export interface OwnerNotificationProps {
  locale: string;
  labels: {
    preview: string;
    heading: string;
    intro: string;
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    requestId: string;
    notProvided: string;
  };
  data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
  };
  requestId: string;
}

/**
 * Owner-facing notification for a new inquiry. All user-provided values are
 * rendered as React text nodes (auto-escaped); the reply-to header is set by the
 * sender, not embedded here.
 */
export function InquiryOwnerNotification({
  locale,
  labels,
  data,
  requestId,
}: OwnerNotificationProps) {
  const rows: [string, string][] = [
    [labels.name, `${data.firstName} ${data.lastName}`],
    [labels.email, data.email],
    [labels.phone, formatUsPhone(data.phone)],
    [labels.subject, data.subject || labels.notProvided],
  ];

  return (
    <EmailLayout locale={locale} preview={labels.preview} heading={labels.heading}>
      <Text style={intro}>{labels.intro}</Text>
      <Section>
        {rows.map(([label, value]) => (
          <Text key={label} style={row}>
            <span style={rowLabel}>{label}: </span>
            <span>{value}</span>
          </Text>
        ))}
      </Section>
      <Hr style={hr} />
      <Text style={rowLabel}>{labels.message}:</Text>
      <Text style={message}>{data.message}</Text>
      <Hr style={hr} />
      <Text style={meta}>
        {labels.requestId}: {requestId}
      </Text>
    </EmailLayout>
  );
}

const intro = { color: "#3a4757", fontSize: "15px", margin: "0 0 16px" };
const row = { color: "#16202e", fontSize: "15px", margin: "6px 0" };
const rowLabel = { color: "#5a6a7e", fontWeight: 600 };
const message = {
  color: "#16202e",
  fontSize: "15px",
  lineHeight: "1.6",
  whiteSpace: "pre-wrap" as const,
  margin: "6px 0 0",
};
const hr = { borderColor: "#e2e7ee", margin: "20px 0" };
const meta = { color: "#8a97a8", fontSize: "12px", margin: "0" };

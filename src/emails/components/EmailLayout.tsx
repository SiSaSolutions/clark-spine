import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { ReactNode } from "react";

/**
 * Shared email shell with inline styles (email clients ignore external CSS).
 * `locale` sets the document language for assistive technology.
 */
export function EmailLayout({
  locale,
  preview,
  heading,
  children,
}: {
  locale: string;
  preview: string;
  heading: string;
  children: ReactNode;
}) {
  return (
    <Html lang={locale}>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Text style={brand}>Clark Spine and Pain Relief</Text>
          </Section>
          <Heading style={h1}>{heading}</Heading>
          {children}
        </Container>
      </Body>
    </Html>
  );
}

const body = {
  backgroundColor: "#f5f8fb",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  margin: "0",
  padding: "24px 0",
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #e2e7ee",
  borderRadius: "12px",
  margin: "0 auto",
  maxWidth: "560px",
  padding: "32px",
};

const header = { borderBottom: "1px solid #e2e7ee", paddingBottom: "16px" };
const brand = { color: "#0a2342", fontSize: "18px", fontWeight: 700, margin: "0" };
const h1 = { color: "#0a2342", fontSize: "22px", margin: "24px 0 8px" };

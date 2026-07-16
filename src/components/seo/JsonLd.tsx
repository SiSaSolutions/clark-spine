/**
 * Render a JSON-LD structured-data block.
 *
 * The payload is our own trusted data, but we still escape `<` to `<` so a
 * value can never break out of the <script> element.
 *
 * No nonce: `type="application/ld+json"` is a non-executable data block, so CSP
 * `script-src` never gates it. Adding a nonce here only caused an SSR/CSR
 * hydration mismatch — Next strips the nonce value from the RSC flight payload
 * (client sees `nonce=""`) while the SSR HTML keeps the real value.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <script
      type="application/ld+json"
      // Trusted, escaped JSON-LD payload (see escaping above).
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}

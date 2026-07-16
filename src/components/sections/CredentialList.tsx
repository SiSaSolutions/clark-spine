/**
 * A titled group of credential entries (education, licensure, experience).
 * Rendered as a description-style list; `sub` is optional.
 */
export function CredentialList({
  title,
  items,
  headingLevel = "h3",
}: {
  title: string;
  items: { main: string; sub: string }[];
  headingLevel?: "h3" | "h4";
}) {
  const Heading = headingLevel;
  return (
    <div className="min-w-0">
      <Heading className="text-brand-800 text-lg">{title}</Heading>
      <ul className="mt-4 space-y-4">
        {items.map((item) => (
          <li key={item.main} className="border-brand-200 border-l-2 pl-4">
            <p className="text-ink font-medium">{item.main}</p>
            {item.sub ? <p className="text-muted mt-0.5 text-sm">{item.sub}</p> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

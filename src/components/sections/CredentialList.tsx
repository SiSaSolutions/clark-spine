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
      <Heading className="text-lg text-brand-800">{title}</Heading>
      <ul className="mt-4 space-y-4">
        {items.map((item) => (
          <li key={item.main} className="border-l-2 border-brand-200 pl-4">
            <p className="font-medium text-ink">{item.main}</p>
            {item.sub ? <p className="mt-0.5 text-sm text-muted">{item.sub}</p> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

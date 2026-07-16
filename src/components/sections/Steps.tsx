/**
 * Numbered process steps. The number is decorative (order is conveyed by the
 * ordered list); each step's title is a heading for a correct outline.
 *
 * Essential content renders statically — it is never hidden behind a scroll or
 * viewport animation, so every step is present without JavaScript, under
 * reduced-motion, and at 200% zoom. The layout is four columns on large
 * screens, two on tablets, and one on small phones. The connector between steps
 * is decorative (aria-hidden) and only appears on the four-column layout, where
 * the steps sit in a single row.
 */
export function Steps({
  steps,
  headingLevel = "h3",
}: {
  steps: { title: string; body: string }[];
  headingLevel?: "h3" | "h4";
}) {
  const Heading = headingLevel;
  return (
    <ol className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((step, index) => (
        <li key={step.title} className="flex min-w-0 flex-col">
          <div className="relative flex items-center">
            <span
              aria-hidden="true"
              className="bg-brand-900 shadow-card relative z-10 inline-flex size-10 shrink-0 items-center justify-center rounded-full font-serif text-lg text-white"
            >
              {index + 1}
            </span>
            {index < steps.length - 1 ? (
              <span
                aria-hidden="true"
                className="bg-brand-200 ml-3 hidden h-px flex-1 lg:block"
              />
            ) : null}
          </div>
          <Heading className="mt-4 text-lg">{step.title}</Heading>
          <p className="text-ink-soft mt-2 text-sm">{step.body}</p>
        </li>
      ))}
    </ol>
  );
}

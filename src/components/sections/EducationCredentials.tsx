import { EducationCard } from "./EducationCard";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

type CredentialGroup = {
  title: string;
  items: { main: string; sub: string }[];
};

/** One restrained credential icon per group, in the order the groups are passed. */
const GROUP_ICONS = ["graduation", "license", "experience", "shield"];

/**
 * The About page's credentials section: the four credential groups (education,
 * licensure, practice leadership, advanced training) rendered as equal-height
 * cards in a plain responsive grid — one column on phones, two from sm, four
 * from lg. Every card is fully readable by scrolling down the page; nothing
 * scrolls sideways and nothing is clipped at the viewport edge.
 */
export function EducationCredentials({
  eyebrow,
  heading,
  intro,
  groups,
}: {
  eyebrow: string;
  heading: string;
  intro?: string;
  groups: CredentialGroup[];
}) {
  return (
    <Section tone="subtle" ariaLabelledby="credentials-heading">
      <SectionHeading
        id="credentials-heading"
        eyebrow={eyebrow}
        title={heading}
        description={intro}
        align="center"
      />
      <ul
        aria-labelledby="credentials-heading"
        className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {groups.map((group, index) => (
          <li key={group.title} className="flex min-w-0">
            <EducationCard
              icon={GROUP_ICONS[index] ?? "graduation"}
              title={group.title}
              items={group.items}
            />
          </li>
        ))}
      </ul>
    </Section>
  );
}

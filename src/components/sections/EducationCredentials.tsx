import { EducationCard } from "./EducationCard";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

type CredentialGroup = {
  title: string;
  items: { main: string; sub: string }[];
};

/** One restrained credential icon per group, in the order the groups are passed. */
const GROUP_ICONS = ["graduation", "license", "experience", "affiliations"];

/**
 * The About page's credentials section: the four credential groups (education,
 * licensure, experience, affiliations) rendered as four equal-height cards on
 * a single row. From lg (laptops/desktops) the row is a four equal-width column
 * grid; below that it becomes an isolated horizontal snap-scroll strip so no
 * card ever wraps onto a second line. The negative margins bleed the strip to
 * the page gutter so the first card aligns with neighboring content and the
 * next card peeks in as a scroll affordance.
 */
export function EducationCredentials({
  eyebrow,
  heading,
  intro,
  groups,
  note,
}: {
  eyebrow: string;
  heading: string;
  intro?: string;
  groups: CredentialGroup[];
  /** Optional qualifying note rendered under the cards (e.g. insurance participation). */
  note?: string;
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
        tabIndex={0}
        className="-mx-5 mt-10 flex snap-x snap-mandatory scroll-pl-5 gap-4 overflow-x-auto px-5 pb-4 sm:-mx-6 sm:scroll-pl-6 sm:px-6 lg:mx-0 lg:grid lg:scroll-pl-0 lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:px-0 lg:pb-0"
      >
        {groups.map((group, index) => (
          <li
            key={group.title}
            className="flex min-w-56 shrink-0 basis-[78%] snap-start sm:basis-[52%] md:basis-[40%] lg:min-w-0 lg:basis-auto"
          >
            <EducationCard
              icon={GROUP_ICONS[index] ?? "graduation"}
              title={group.title}
              items={group.items}
            />
          </li>
        ))}
      </ul>
      {note ? (
        <p className="text-ink-soft mx-auto mt-8 max-w-2xl text-center text-sm">{note}</p>
      ) : null}
    </Section>
  );
}

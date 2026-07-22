# Unverified content — remaining items before launch

The practice has confirmed its core facts (name, provider, address, phone, fax,
year established, office hours), professional credentials (Palmer College of
Chiropractic · 1988, NJ License #MCO-3710, Trauma Qualified), and insurance /
network participation (Medicare, Horizon BCBS of NJ Tier 1, Hackensack Meridian
Inner Circle). Those are now treated as verified and live in
`src/data/practice.ts` and the locale dictionaries.

The following items remain open:

## 1. Public inquiry email

No public inbox address is displayed. The inquiry form delivers server-side to
`INQUIRY_OWNER_EMAIL`; `practice.email` stays `null` until the practice supplies
a public-facing address to show in the UI.

## 2. Provider portrait

The About portrait is now the practice-supplied headshot
`public/images/practice/dr-james-garabo.webp` (474×592, exact 4:5). It renders
in a ~320px-wide frame, which is adequate on high-density displays. A larger
original would still be welcome if available for future use.

## 2a. Exterior office photos (Contact page)

The Contact "Practice information" area shows two practice-supplied exterior
photos (`practice-building-sign.jpg`, `practice-front-door.jpg`). Their alt text
references the **"Marcus Plaza" building name / Garabo Chiropractic signage**,
which is visible in the photographs — confirm the plaza name is current before
launch. The earlier directional paragraph ("follow the walkway to the office
entrance") has been removed. The walkway photo (`practice-walkway.jpg`) remains
in the repo but is currently unused. Written publication rights for the
photographs must also be confirmed (see item 4).

## 2b. Interior office photos (About page) — pending

The interior waiting-area and treatment-hallway photos were **not** added: the
only available source files are 360×480px, too low for crisp high-density
rendering. Awaiting higher-resolution originals from the practice; the "Our
Office" About section will be added once they are supplied.

## 3. Final Privacy Policy / legal review

Privacy Policy copy must be reviewed by the practice (and counsel where
appropriate) before launch, especially any HIPAA-adjacent statements.

## 4. Rights for future testimonials or photography

Testimonials and star-rating / review structured data remain excluded. Re-adding
any testimonial requires verified wording **and** written publication rights from
each patient. Confirm usage rights for any future photography before publishing.

## 5. "Accepting new patients" availability claim

The hero eyebrow now displays "Accepting new patients · Clark, NJ". Confirm with
the practice that they are actively accepting new patients before launch; remove
or reword the eyebrow if that is not current.

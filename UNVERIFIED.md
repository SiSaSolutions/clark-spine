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

## 2. Higher-resolution provider portrait

`public/images/dr-garabo.png` is only 386×386px. Request a higher-resolution
portrait for crisp rendering on high-density displays.

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

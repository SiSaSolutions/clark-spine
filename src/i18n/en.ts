/**
 * English dictionary — the canonical shape for all locales.
 *
 * `Dictionary = typeof en` (see ./dictionaries.ts), so every other locale file
 * must structurally match this object. Keys and array lengths are also verified
 * at build time by `scripts/check-translations.ts`.
 *
 * Content is factual and non-promissory. Items requiring business sign-off are
 * tracked in UNVERIFIED.md and must be confirmed before launch. `icon` values
 * are locale-neutral keys resolved to icons in `@/components/ui/Icon`.
 */
const en = {
  meta: {
    siteName: "Clark Spine and Pain Relief",
    defaultTitle: "Clark Spine and Pain Relief | Chiropractor in Clark, NJ",
    defaultDescription:
      "Dr. James Garabo, DC provides chiropractic and pain-relief care in Clark, New Jersey, with a focus on spine pain and motor vehicle accident injuries.",
    ogImageAlt: "Clark Spine and Pain Relief in Clark, New Jersey",
  },

  common: {
    skipToContent: "Skip to main content",
    call: "Call",
    email: "Email",
    fax: "Fax",
    address: "Address",
    officeHours: "Office Hours",
    closed: "Closed",
    getDirections: "Get directions",
    menu: "Menu",
    closeMenu: "Close menu",
    openMenu: "Open menu",
    language: "Language",
    currentLanguage: "English",
    breadcrumb: "Breadcrumb",
  },

  nav: {
    home: "Home",
    about: "About",
    services: "Services",
    autoAccidents: "Auto Accident Care",
    patientCenter: "Patient Center",
    contact: "Contact",
    inquiry: "Request Appointment",
  },

  footer: {
    orgName: "Garabo Chiropractic Health Center, PC",
    description:
      "Chiropractic and pain-relief care in Clark, New Jersey, with a focus on spine pain and motor vehicle accident injuries.",
    quickLinks: "Quick Links",
    contactHeading: "Contact",
    hoursHeading: "Office Hours",
    rightsReserved: "All rights reserved.",
    disclaimer:
      "The information on this website is for general educational purposes only and does not constitute medical advice or create a doctor–patient relationship.",
    days: {
      monday: "Monday",
      tuesday: "Tuesday",
      wednesday: "Wednesday",
      thursday: "Thursday",
      friday: "Friday",
      saturday: "Saturday",
      sunday: "Sunday",
    },
  },

  home: {
    metaTitle: "Clark Spine and Pain Relief | Chiropractor in Clark, NJ",
    metaDescription:
      "Chiropractic care for back pain, neck pain, sciatica and auto-accident injuries in Clark, New Jersey. Dr. James Garabo, DC. Request an appointment today.",
    hero: {
      eyebrow: "Accepting new patients · Clark, NJ",
      titleSegments: [
        { text: "Relief for ", accent: false },
        { text: "Auto Accident & Spine", accent: true },
        { text: " Pain", accent: false },
      ],
      subtitle:
        "Experienced care for whiplash, neck pain, back pain, sciatica, and other injuries following a motor vehicle accident — plus everyday chiropractic care for spine and pain.",
      provider: "Dr. James Garabo, DC",
      providerNote: "Trauma Qualified · More than 35 years of experience",
      primaryCta: "Request an Appointment",
      secondaryCta: "Auto Accident Care",
      callLabel: "or call",
    },
    stats: {
      heading: "Practice at a glance",
      items: [
        { value: "35+", label: "Years of experience" },
        { value: "1991", label: "Established in Clark, NJ" },
        { value: "Palmer", label: "College of Chiropractic" },
        { value: "MCO-3710", label: "NJ Chiropractic License" },
      ],
    },
    autoAccident: {
      eyebrow: "Auto Accident Injury Care",
      heading: "Recently in a car accident?",
      body: "After a motor vehicle accident, a chiropractic evaluation can help identify injuries and start a clear treatment plan. Some symptoms are not obvious right away and can develop over the following days.",
      issuesLabel: "Symptoms we commonly evaluate",
      issues: [
        "Whiplash and neck pain",
        "Back pain and stiffness",
        "Headaches",
        "Radiating pain, numbness, or tingling",
      ],
      provideLabel: "In-office evaluation and documentation",
      provides: [
        "On-site X-rays and a physical and neurological examination",
        "MRI interpretation, correlated with your symptoms",
        "Thorough records and reports for insurers and attorneys",
      ],
      note: "The practice has cared for motor vehicle accident patients in New Jersey for more than three decades.",
      primaryCta: "Auto Accident Care",
      secondaryCta: "Request an Appointment",
    },
    services: {
      eyebrow: "What We Treat",
      heading: "Comprehensive spine & pain care",
      body: "Focused chiropractic care for a range of spinal conditions and musculoskeletal injuries — with auto accident recovery as a primary specialty.",
      featured: {
        badge: "Primary specialty",
        title: "Auto accident injuries",
        body: "Evaluation, treatment, and thorough documentation for whiplash, disc injuries, and spinal trauma following a motor vehicle accident.",
        conditionsLabel: "Commonly treated",
        conditions: [
          "Whiplash (WAD)",
          "Disc herniation",
          "Soft-tissue injuries",
          "Radiating pain",
        ],
        cta: "Auto Accident Care",
      },
      items: [
        {
          icon: "spine",
          title: "Back pain",
          body: "Care for upper, mid, and lower back pain.",
        },
        { icon: "neck", title: "Neck pain", body: "Cervical spine pain and stiffness." },
        {
          icon: "sciatica",
          title: "Sciatica",
          body: "Sciatic nerve pain and radiculopathy.",
        },
        {
          icon: "shockwave",
          title: "Shock wave therapy",
          body: "Acoustic pressure-wave therapy for injured soft tissue, when clinically indicated.",
        },
        {
          icon: "mri",
          title: "MRI interpretation",
          body: "Review and reporting of spinal imaging.",
        },
      ],
      exploreCta: "Explore all services",
    },
    approach: {
      heading: "A straightforward path to relief",
      steps: [
        {
          title: "Request an appointment",
          body: "Call the office or send a request through our form. New patients are welcome.",
        },
        {
          title: "In-office evaluation",
          body: "A thorough examination and any needed imaging lead to an accurate diagnosis.",
        },
        {
          title: "Your care plan",
          body: "A short-term, individualized treatment plan focused on relieving your pain.",
        },
        {
          title: "Begin care and track progress",
          body: "Start your plan and review progress at each visit, adjusting as you improve.",
        },
      ],
    },
    cta: {
      heading: "Ready to get started?",
      body: "Request an appointment and our team will be in touch to confirm your visit.",
      button: "Request an Appointment",
    },
  },

  about: {
    metaTitle: "About the Practice",
    metaDescription:
      "Learn about Clark Spine and Pain Relief and Dr. James Garabo, DC — chiropractic care in Clark, New Jersey since 1991.",
    heroEyebrow: "About Our Practice",
    heroTitle: "Our practice",
    heroSubtitle: "Serving Clark, New Jersey and surrounding communities since 1991.",
    imageAlt: "Dr. James Garabo of Clark Spine and Pain Relief",
    bio: {
      heading: "About Clark Spine and Pain Relief",
      paragraphs: [
        "Clark Spine and Pain Relief (Garabo Chiropractic Health Center, PC) has served patients in Clark, New Jersey and the surrounding communities since 1991. Under the direction of Dr. James Garabo, DC, the practice focuses on an accurate diagnosis and a clear treatment plan for every patient.",
        "Dr. Garabo is a Palmer College of Chiropractic graduate whose work spans the diagnosis and management of mechanical spine pain, MRI interpretation, and medical-legal documentation.",
        "The office provides care for back pain, sciatica, neck pain, headaches, and radiating pain, with treatment plans designed to be short-term and individualized.",
      ],
    },
    credentials: {
      eyebrow: "Credentials & training",
      heading: "A foundation built on professional study",
      intro:
        "Explore the education, licensure, and clinical experience that shaped Dr. Garabo's approach to patient care.",
      education: {
        title: "Education",
        items: [
          {
            main: "Doctor of Chiropractic",
            sub: "Palmer College of Chiropractic · Davenport, IA · 1988",
          },
          { main: "National Board of Chiropractic Examiners, Part 1 · 1986", sub: "" },
          { main: "National Board of Chiropractic Examiners, Part 2 · 1987", sub: "" },
        ],
      },
      licensure: {
        title: "Licensure",
        items: [
          { main: "New Jersey License #MCO-3710", sub: "Active" },
          { main: "Pennsylvania License · 1988", sub: "Inactive" },
          { main: "Massachusetts License · 1989", sub: "Inactive" },
        ],
      },
      experience: {
        title: "Experience",
        items: [
          {
            main: "Clinic Director — Garabo Chiropractic Health Center, PC",
            sub: "Clark, NJ · 1991 – Present",
          },
          {
            main: "Associate Doctor — Delano Family Chiropractic Center",
            sub: "Bloomfield, NJ · 1989 – 1991",
          },
        ],
      },
      affiliations: {
        title: "Insurance & affiliations",
        items: [
          { main: "Trauma Qualified", sub: "" },
          { main: "Medicare", sub: "" },
          { main: "Horizon BCBS of New Jersey", sub: "Tier 1" },
          { main: "Hackensack Meridian", sub: "Inner Circle" },
          { main: "Aetna", sub: "" },
        ],
      },
      insuranceNote:
        "The practice works with multiple insurance plans, including Aetna. Patients should contact their insurer or the office to confirm plan-specific benefits.",
    },
  },

  services: {
    metaTitle: "Services",
    metaDescription:
      "Chiropractic services at Clark Spine and Pain Relief: care for back and neck pain, sciatica, headaches, auto accident injuries, plus on-site diagnostics.",
    heroEyebrow: "What We Do",
    heroTitle: "Our services",
    heroSubtitle: "Comprehensive chiropractic care, all under one roof.",
    conditionsLabel: "Conditions addressed",
    categories: [
      {
        id: "conditions",
        title: "Conditions we treat",
        description:
          "From acute injuries to chronic spinal conditions, we provide targeted care for a range of musculoskeletal diagnoses.",
        items: [
          {
            icon: "car",
            title: "Auto accident injuries",
            body: "Evaluation, treatment, and documentation of injuries from motor vehicle accidents, including whiplash and disc injuries.",
            conditions: [
              "Whiplash (WAD)",
              "Disc herniation",
              "Soft-tissue injuries",
              "Radiculopathy from trauma",
            ],
          },
          {
            icon: "spine",
            title: "Back pain",
            body: "Care for upper, mid, and lower back pain using chiropractic adjustments, soft-tissue therapy, and rehabilitation strategies.",
            conditions: [
              "Disc herniation",
              "Lumbar sprain / strain",
              "Facet syndrome",
              "Spinal stenosis",
            ],
          },
          {
            icon: "neck",
            title: "Neck pain",
            body: "Diagnosis and management of cervical mechanical pain, including whiplash injuries from auto accidents.",
            conditions: [
              "Cervical disc herniation",
              "Whiplash (WAD)",
              "Cervical radiculopathy",
              "Muscle spasm",
            ],
          },
          {
            icon: "sciatica",
            title: "Sciatica",
            body: "Identifying the source of radiating leg pain and building a targeted treatment plan.",
            conditions: [
              "Lumbar disc herniation",
              "Piriformis syndrome",
              "Spinal stenosis",
              "Nerve-root compression",
            ],
          },
          {
            icon: "headache",
            title: "Headaches",
            body: "Assessment and conservative management of headaches with a cervical (neck-related) component.",
            conditions: [
              "Cervicogenic headaches",
              "Tension headaches",
              "Post-concussion headaches",
            ],
          },
          {
            icon: "nerve",
            title: "Radiating pain",
            body: "Care for pain, numbness, or weakness that radiates from the spine into the limbs, correlating findings with imaging.",
            conditions: [
              "Upper-extremity radiculopathy",
              "Lower-extremity radiculopathy",
            ],
          },
        ],
      },
      {
        id: "treatments",
        title: "Treatments & therapies",
        description:
          "Hands-on, evidence-informed treatments designed to relieve pain and support the body's natural healing.",
        items: [
          {
            icon: "adjustment",
            title: "Spinal manipulation",
            body: "Precise, controlled chiropractic adjustments to restore joint motion and reduce pain. Techniques are tailored to each patient's condition, age, and comfort, with low-force options available.",
            conditions: [],
          },
          {
            icon: "shockwave",
            title: "Shock wave therapy",
            body: "Extracorporeal shock wave therapy uses acoustic pressure waves to support healing in injured soft tissues. Suitability is determined on a case-by-case basis.",
            conditions: [],
          },
        ],
      },
      {
        id: "diagnostics",
        title: "Diagnostics & evaluation",
        description:
          "In-office diagnostic capabilities that support an accurate diagnosis from your first visit.",
        items: [
          {
            icon: "xray",
            title: "On-site X-rays",
            body: "Digital X-ray imaging performed in the office to help identify spinal misalignment, fractures, and structural changes — useful in post-accident evaluations.",
            conditions: [],
          },
          {
            icon: "exam",
            title: "Physical examinations",
            body: "A thorough physical and neurological examination — orthopedic testing, neurological assessment, range of motion, and strength testing — before treatment begins.",
            conditions: [],
          },
          {
            icon: "mri",
            title: "MRI interpretation",
            body: "Review and interpretation of spinal MRI, correlating imaging findings with clinical symptoms, with reporting for medical-legal cases.",
            conditions: [],
          },
        ],
      },
    ],
    cta: {
      heading: "Struggling with pain or recovering from an accident?",
      body: "Request an appointment and we will help you find a path to relief.",
      button: "Request an Appointment",
    },
  },

  autoAccidents: {
    metaTitle: "Auto Accident Injury Care",
    metaDescription:
      "Chiropractic care and documentation for motor vehicle accident injuries in Clark, NJ — from the first visit through case resolution.",
    heroEyebrow: "Auto Accident Injury Care",
    heroTitle: "Auto accident injury care",
    heroSubtitle:
      "Chiropractic treatment and thorough medical-legal documentation — from the first visit through case resolution.",
    urgency: {
      heading: "Why prompt care matters",
      subtitle:
        "Symptoms after a collision can be delayed. An early evaluation supports both your health and any insurance or legal claim.",
      items: [
        {
          icon: "clock",
          title: "Symptoms are often delayed",
          body: "Adrenaline and inflammation can mask injury pain for days. A clinical evaluation helps identify injuries that are not yet obvious.",
        },
        {
          icon: "document",
          title: "Documentation starts early",
          body: "A prompt medical record helps establish the connection between the accident and your injuries.",
        },
        {
          icon: "recovery",
          title: "Earlier care supports recovery",
          body: "Addressing spinal injuries early can reduce the likelihood of long-term problems.",
        },
      ],
    },
    injuries: {
      heading: "Common auto accident injuries",
      subtitle:
        "We evaluate and treat a range of injuries that follow motor vehicle accidents.",
      items: [
        {
          icon: "whiplash",
          title: "Whiplash (WAD)",
          body: "Cervical acceleration–deceleration injury — the most common auto accident injury.",
        },
        {
          icon: "disc",
          title: "Disc herniation",
          body: "Traumatic disc herniation in the cervical or lumbar spine from impact forces.",
        },
        {
          icon: "softtissue",
          title: "Soft-tissue injuries",
          body: "Muscle, ligament, and tendon injuries throughout the spine and extremities.",
        },
        {
          icon: "nerve",
          title: "Radiculopathy",
          body: "Nerve-root compression causing radiating pain, numbness, or weakness.",
        },
        {
          icon: "headache",
          title: "Post-concussion headaches",
          body: "Head and neck-related pain following head trauma or sudden deceleration.",
        },
        {
          icon: "spine",
          title: "Spinal subluxations",
          body: "Vertebral misalignments affecting joint motion following trauma.",
        },
      ],
    },
    process: {
      heading: "What to expect as an accident patient",
      steps: [
        {
          title: "Prompt scheduling",
          body: "Call and we will see you as soon as possible — often the same or next day.",
        },
        {
          title: "Comprehensive evaluation",
          body: "A full orthopedic and neurological exam, including on-site X-rays when clinically indicated.",
        },
        {
          title: "Diagnosis & treatment plan",
          body: "An accurate diagnosis and a focused care plan tailored to your injuries.",
        },
        {
          title: "Documentation throughout",
          body: "Thorough medical records and reports for your insurer, attorney, or referring physician.",
        },
      ],
    },
    legal: {
      heading: "Documentation for your case",
      body: "The practice has served auto accident patients and the New Jersey legal community for over three decades, and understands what insurers, attorneys, and referring physicians need from a treating provider.",
      items: [
        "Initial injury evaluation reports",
        "Narrative medical reports",
        "MRI interpretation and age-dating reports",
        "Expert testimony and depositions",
        "Progress and final status reports",
      ],
    },
    cta: {
      heading: "Involved in an accident?",
      body: "Request an appointment for a prompt evaluation.",
      button: "Request an Appointment",
    },
  },

  // Content preserved from the practice's original Patient Center page (forms
  // list, fax instructions, FAQs, insurance items), reorganized and expanded
  // with the new bilingual form workflow. See UNVERIFIED.md for pending items.
  patientCenter: {
    metaTitle: "Patient Center",
    metaDescription:
      "Access patient forms, submission instructions, insurance information, and resources for preparing for an appointment at Clark Spine and Pain Relief.",
    heroEyebrow: "Patient Center",
    heroTitle: "Prepare for your visit",
    heroSubtitle:
      "Access patient forms, review submission options, and find helpful information before your appointment.",
    heroNote:
      "Forms will be available in English and Spanish and can be completed digitally or printed.",

    workflow: {
      eyebrow: "How It Works",
      heading: "Complete your forms in four simple steps",
      body: "Choose the form you need, complete it at your convenience, and submit it using the option that works best for you.",
      steps: [
        {
          title: "Choose your form",
          body: "Select the document you need in English or Spanish.",
        },
        {
          title: "Download and complete it",
          body: "Download the editable PDF to your phone, tablet, or computer and enter your information.",
        },
        {
          title: "Save the completed form",
          body: "Save a completed copy to your device before submitting or printing it.",
        },
        {
          title: "Submit your form",
          body: "Email it to the office, fax it, or print it and bring it to your appointment.",
        },
      ],
    },

    resources: {
      // Eyebrow and heading preserved from the original forms section.
      eyebrow: "Patient Paperwork",
      heading: "Download patient forms",
      // Original intent preserved ("complete forms at home and bring them or
      // fax them"), updated so the digital and offline options are both clear.
      body: "Complete forms in the comfort of your home and bring them to your appointment — or send them to the office by email or fax.",
      downloadLabel: "Download PDF",
      downloadAriaLabel: "Download {title} (PDF)",
      externalLabel: "Open online form",
      externalAriaLabel: "Open {title} (opens in a new tab)",
      pdfComingSoon: "PDF coming soon",
      externalComingSoon: "Online form coming soon",
      // Items pair by id with src/data/patient-forms.ts. All four form names
      // and descriptions are preserved from the original Patient Center.
      items: [
        {
          id: "new-patient-intake",
          title: "New Patient Intake Form",
          description:
            "Complete this form before your first visit. Covers personal information, medical history, and current symptoms.",
        },
        {
          id: "personal-injury-questionnaire",
          title: "Personal Injury Questionnaire",
          description:
            "For patients involved in auto accidents or personal injury cases. Documents mechanism of injury and symptom onset.",
        },
        {
          id: "insurance-patient-form",
          title: "Insurance Patient Form",
          description:
            "Covers your health insurance information and authorizations for billing. Required for all insured patients.",
        },
        {
          id: "financial-policy-hipaa",
          title: "Financial Policy & HIPAA Notice",
          description:
            "Our office financial policy and HIPAA privacy practices notice. Required for all new patients.",
        },
      ],
    },

    submission: {
      eyebrow: "Submitting Your Forms",
      heading: "Choose the option that works best for you",
      email: {
        title: "Email the completed form",
        body: "Save the completed document and attach it to an email addressed to the office.",
        subject: "Completed Patient Form",
        linkAriaLabel: "Email the office at {address}",
      },
      fax: {
        title: "Send it by fax",
        body: "Fax the completed form to the office using the number below.",
      },
      print: {
        title: "Print and bring it with you",
        body: "Print the completed form and bring it to the office at your appointment.",
      },
    },

    insurance: {
      eyebrow: "Insurance Information",
      heading: "Understanding your coverage",
      intro:
        "Clark Spine and Pain Relief accepts most major insurance plans, including Aetna, Medicare, Horizon Blue Cross Blue Shield of New Jersey, and participating Hackensack Meridian Health plans. Coverage, benefits, referrals, deductibles, copayments, and patient responsibility vary by plan.",
      intro2:
        "We also work with personal injury cases and offer payment options for uninsured or underinsured patients. Contact your insurance provider or our office before treatment to confirm your individual benefits and coverage.",
      plansLabel: "Insurance Plans & Networks",
      optionsLabel: "Additional Coverage & Payment Options",
      verifyNote:
        "Insurance participation and benefits can vary by individual plan. Please contact your insurance provider or our office to confirm coverage before your appointment.",
      // Pairs by id (and order) with src/data/insurance.ts. Plans/networks first,
      // then additional coverage & payment options. Names preserved from the
      // original Patient Center section, plus Aetna and Payment Plans.
      providers: [
        { id: "medicare", name: "Medicare", note: "" },
        { id: "aetna", name: "Aetna", note: "" },
        { id: "horizon-bcbs-nj", name: "Horizon BC/BS NJ", note: "Tier 1 Provider" },
        { id: "hackensack-meridian", name: "Hackensack Meridian", note: "Inner Circle" },
        { id: "major-plans", name: "Most Major Insurance Plans", note: "" },
        { id: "personal-injury", name: "Personal Injury Cases", note: "" },
        { id: "uninsured", name: "Uninsured & Underinsured Patients", note: "" },
        { id: "payment-plans", name: "Payment Plans", note: "" },
      ],
    },

    faq: {
      // Eyebrow and heading preserved from the original FAQ section.
      eyebrow: "FAQs",
      heading: "Common questions",
      items: [
        {
          question: "What should I bring to my first appointment?",
          answer:
            "Please bring your completed intake forms, a valid photo ID, your insurance card, and any imaging (X-ray, MRI) films or reports related to your condition.",
        },
        {
          question: "Do you accept my insurance?",
          answer:
            "We accept most major insurance plans including Medicare and Aetna. We are a Tier 1 provider for Horizon BC/BS of NJ and an “Inner Circle” provider for Hackensack Meridian employees. Plan participation and individual benefits can vary, so call us at (908) 497-9440 to verify your specific plan.",
        },
        {
          question: "How long are treatment plans?",
          answer:
            "We advocate for short-term, focused treatment plans designed to get you relief and correction as efficiently as possible. Most patients see significant improvement within a few weeks.",
        },
        {
          question: "Can I complete the forms on my phone?",
          answer:
            "Yes. Our forms are editable PDFs that can be opened, completed, and saved directly on most modern phones and tablets without installing any additional software.",
        },
        {
          question: "How do I save a completed form?",
          answer:
            "Use your PDF application’s save, save a copy, or share option. Confirm that your information remains visible after saving before submitting the document.",
        },
        {
          question: "How can I submit my forms?",
          answer:
            "You may email the saved document to the office, fax it to (908) 497-9442, or print it and bring it to your appointment.",
        },
      ],
    },

    cta: {
      heading: "Need help before your visit?",
      body: "Contact the office with questions about forms, insurance, or preparing for your appointment.",
      contactButton: "Contact the Office",
      appointmentButton: "Request Appointment",
    },
  },

  contact: {
    metaTitle: "Contact",
    metaDescription:
      "Contact Clark Spine and Pain Relief in Clark, New Jersey. Call (908) 497-9440 or request an appointment online.",
    heroEyebrow: "Contact",
    heroTitle: "Visit or contact our office",
    heroSubtitle:
      "Have a question, need directions, or want to schedule an appointment? Contact Clark Spine and Pain Relief and our team will be happy to assist you.",
    infoHeading: "Practice information",
    hoursHeading: "Office hours",
    hoursNote: "Call to confirm holiday hours or same-day availability.",
    phoneLabel: "Phone",
    faxLabel: "Fax",
    addressLabel: "Address",
    directions: "Get directions",
    emergencyNotice:
      "If you are experiencing a medical emergency, call 911 or go to the nearest emergency room. Please do not use this website to report an emergency.",
    location: {
      mapTitle: "Map showing Clark Spine and Pain Relief in Clark, New Jersey",
    },
    findingHeading: "Finding Our Office",
    findingIntro:
      "Use these photos to identify the plaza and office entrance when you arrive.",
    buildingLabel: "Marcus Plaza",
    doorLabel: "Office entrance",
    buildingHint: "Look for the plaza sign beside the walkway.",
    doorHint: "Enter through the door marked Garabo Chiropractic.",
    parkingNote: "Additional parking is available behind the building.",
    buildingImageAlt:
      "Marcus Plaza sign and walkway leading to Clark Spine and Pain Relief",
    doorImageAlt: "Entrance door to the Clark Spine and Pain Relief office",
    buildingCaption: "Look for the Marcus Plaza entrance",
    doorCaption: "Office entrance",
    viewBuildingPhoto: "Open Marcus Plaza photo",
    viewDoorPhoto: "Open office entrance photo",
    lightbox: {
      previous: "Previous image",
      next: "Next image",
      close: "Close image viewer",
      counter: "Image {current} of {total}",
      dialogLabel: "Office location photos",
    },
    cta: {
      heading: "Request an appointment",
      body: "Send a request through our secure form and our team will be in touch to confirm your visit.",
      button: "Go to the appointment form",
    },
  },

  inquiry: {
    metaTitle: "Request an Appointment",
    metaDescription:
      "Request an appointment with Clark Spine and Pain Relief in Clark, New Jersey using our secure online form.",
    heroEyebrow: "Request an Appointment",
    heroTitle: "Request an appointment",
    heroSubtitle:
      "Complete the form and our team will contact you to confirm your visit.",
    emergencyNotice:
      "Do not use this form for medical emergencies or to share sensitive medical details. If this is an emergency, call 911. Submitting this form does not create a doctor–patient relationship.",
    form: {
      requiredHint: "Required fields are marked with an asterisk (*).",
      optional: "optional",
      firstName: "First name",
      lastName: "Last name",
      email: "Email address",
      phone: "Phone number",
      subject: "Subject",
      message: "Message",
      messageHint: "Please tell us briefly how we can help.",
      submit: "Send request",
      submitting: "Sending…",
      privacyNote: "We use your information only to respond to your request.",
      turnstileLabel: "Security verification",
      errorSummaryTitle: "Please review the form",
      errors: {
        required: "This field is required.",
        invalidName: "Please enter a valid name (letters, spaces, hyphens, apostrophes).",
        invalidEmail: "Please enter a valid email address.",
        phoneRequired: "Phone number is required.",
        phoneLength: "Enter a valid 10-digit phone number.",
        phoneInvalid: "Phone number can contain digits only.",
        tooLong: "This value is too long.",
        messageTooShort: "Please enter at least 10 characters.",
        captcha: "Please complete the security verification.",
        rateLimit: "Please wait {seconds} seconds before trying again.",
        server: "Something went wrong on our end. Please try again or call us.",
        network:
          "We couldn’t reach the server. Please check your connection and try again.",
      },
    },
    thankYou: {
      metaTitle: "Thank You",
      metaDescription: "Your appointment request has been received.",
      title: "Thank you — your request was received",
      body: "We’ve received your request and will be in touch to confirm your visit. A confirmation email is on its way.",
      emergencyNote:
        "Remember: if you are experiencing a medical emergency, call 911 or go to the nearest emergency room.",
      backHome: "Back to homepage",
      viewServices: "View our services",
    },
  },

  privacy: {
    navLabel: "Privacy Policy",
    metaTitle: "Privacy Policy",
    metaDescription:
      "How Clark Spine and Pain Relief handles information submitted through this website.",
    title: "Privacy Policy",
    lastUpdatedLabel: "Last updated",
    lastUpdated: "This policy is under review and pending final approval.",
    intro:
      "This Privacy Policy explains how Clark Spine and Pain Relief handles information you provide through this website. It applies to this website only and is not a substitute for the practice's Notice of Privacy Practices provided to patients.",
    sections: [
      {
        heading: "Information we collect",
        body: [
          "When you use the appointment request form, we collect the information you choose to submit: your name, email address, phone number, a subject, and your message.",
          "Please do not submit sensitive medical information or details of a medical emergency through this website.",
        ],
      },
      {
        heading: "How we use your information",
        body: [
          "We use the information you submit only to respond to your request and to contact you about your inquiry.",
          "We do not sell your information, and we do not use it for advertising.",
        ],
      },
      {
        heading: "Service providers",
        body: [
          "We use trusted third-party services to operate the form: an email delivery provider to send your message to the office, a security service to help prevent automated abuse, and a rate-limiting service to protect the form. These providers process limited technical information on our behalf.",
        ],
      },
      {
        heading: "Data retention",
        body: [
          "Inquiry messages are retained by the office only as long as needed to respond to and manage your request.",
        ],
      },
      {
        heading: "Contact",
        body: [
          "For questions about this policy or about information you submitted through this website, please contact the office by phone.",
        ],
      },
    ],
  },

  notFound: {
    title: "Page not found",
    body: "Sorry, we couldn’t find the page you were looking for.",
    cta: "Go to the homepage",
  },
};

export default en;

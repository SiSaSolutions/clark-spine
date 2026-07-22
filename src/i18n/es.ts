import type { Dictionary } from "./dictionaries";

/**
 * Spanish dictionary. Must structurally match the English dictionary
 * (enforced by the `Dictionary` type and by scripts/check-translations.ts).
 * Reviewed for tone and grammar appropriate to a healthcare practice.
 */
const es: Dictionary = {
  meta: {
    siteName: "Clark Spine and Pain Relief",
    defaultTitle: "Clark Spine and Pain Relief | Quiropráctico en Clark, NJ",
    defaultDescription:
      "El Dr. James Garabo, DC ofrece atención quiropráctica y alivio del dolor en Clark, Nueva Jersey, con enfoque en el dolor de columna y las lesiones por accidentes de auto.",
    ogImageAlt: "Clark Spine and Pain Relief en Clark, Nueva Jersey",
  },

  common: {
    skipToContent: "Saltar al contenido principal",
    call: "Llamar",
    email: "Correo",
    fax: "Fax",
    address: "Dirección",
    officeHours: "Horario de Oficina",
    closed: "Cerrado",
    getDirections: "Cómo llegar",
    menu: "Menú",
    closeMenu: "Cerrar menú",
    openMenu: "Abrir menú",
    languageLabel: "Idioma",
    breadcrumb: "Ruta de navegación",
  },

  nav: {
    home: "Inicio",
    about: "Nosotros",
    services: "Servicios",
    autoAccidents: "Accidentes de Auto",
    contact: "Contacto",
    inquiry: "Solicitar Cita",
  },

  footer: {
    orgName: "Garabo Chiropractic Health Center, PC",
    description:
      "Atención quiropráctica y alivio del dolor en Clark, Nueva Jersey, con enfoque en el dolor de columna y las lesiones por accidentes de auto.",
    quickLinks: "Enlaces Rápidos",
    contactHeading: "Contacto",
    hoursHeading: "Horario de Oficina",
    rightsReserved: "Todos los derechos reservados.",
    disclaimer:
      "La información de este sitio web tiene únicamente fines educativos generales y no constituye consejo médico ni crea una relación médico–paciente.",
    days: {
      monday: "Lunes",
      tuesday: "Martes",
      wednesday: "Miércoles",
      thursday: "Jueves",
      friday: "Viernes",
      saturday: "Sábado",
      sunday: "Domingo",
    },
  },

  home: {
    metaTitle: "Clark Spine and Pain Relief | Quiropráctico en Clark, NJ",
    metaDescription:
      "Atención quiropráctica para el dolor de espalda, cuello, ciática y lesiones por accidentes de auto en Clark, Nueva Jersey. Dr. James Garabo, DC. Solicite una cita hoy.",
    hero: {
      eyebrow: "Aceptando nuevos pacientes · Clark, NJ",
      titleSegments: [
        { text: "Alivio del dolor por ", accent: false },
        { text: "accidentes de auto", accent: true },
        { text: " y de columna", accent: false },
      ],
      subtitle:
        "Atención con experiencia para el latigazo cervical, el dolor de cuello, el dolor de espalda, la ciática y otras lesiones tras un accidente de vehículo motorizado — además de atención quiropráctica habitual para la columna y el dolor.",
      provider: "Dr. James Garabo, DC",
      providerNote: "Trauma Qualified · Más de 35 años de experiencia",
      primaryCta: "Solicitar una Cita",
      secondaryCta: "Atención de Accidentes",
      callLabel: "o llame al",
    },
    stats: {
      heading: "La práctica en resumen",
      items: [
        { value: "35+", label: "Años de experiencia" },
        { value: "1991", label: "Establecido en Clark, NJ" },
        { value: "Palmer", label: "College of Chiropractic" },
        { value: "MCO-3710", label: "Licencia de NJ" },
      ],
    },
    autoAccident: {
      eyebrow: "Atención de Lesiones por Accidente de Auto",
      heading: "¿Tuvo un accidente de auto recientemente?",
      body: "Tras un accidente de vehículo motorizado, una evaluación quiropráctica puede ayudar a identificar lesiones y a iniciar un plan de tratamiento claro. Algunos síntomas no son evidentes de inmediato y pueden aparecer en los días siguientes.",
      issuesLabel: "Síntomas que evaluamos con frecuencia",
      issues: [
        "Latigazo cervical y dolor de cuello",
        "Dolor de espalda y rigidez",
        "Dolores de cabeza",
        "Dolor irradiado, entumecimiento u hormigueo",
      ],
      provideLabel: "Evaluación y documentación en la oficina",
      provides: [
        "Rayos X en sitio y un examen físico y neurológico",
        "Interpretación de MRI, correlacionada con sus síntomas",
        "Registros e informes completos para aseguradoras y abogados",
      ],
      note: "La práctica ha atendido a pacientes de accidentes de vehículo motorizado en Nueva Jersey por más de tres décadas.",
      primaryCta: "Atención de Accidentes",
      secondaryCta: "Solicitar una Cita",
    },
    services: {
      eyebrow: "Lo Que Tratamos",
      heading: "Atención integral de columna y dolor",
      body: "Atención quiropráctica enfocada para diversas condiciones de la columna y lesiones musculoesqueléticas — con la recuperación de accidentes de auto como especialidad principal.",
      featured: {
        badge: "Especialidad principal",
        title: "Lesiones por accidentes de auto",
        body: "Evaluación, tratamiento y documentación completa del latigazo cervical, las lesiones de disco y el trauma espinal tras un accidente de vehículo motorizado.",
        conditionsLabel: "Tratamos comúnmente",
        conditions: [
          "Latigazo cervical (WAD)",
          "Hernia de disco",
          "Lesiones de tejidos blandos",
          "Dolor irradiado",
        ],
        cta: "Atención de Accidentes",
      },
      items: [
        {
          icon: "spine",
          title: "Dolor de espalda",
          body: "Atención para el dolor de espalda alta, media y baja.",
        },
        {
          icon: "neck",
          title: "Dolor de cuello",
          body: "Dolor y rigidez de la columna cervical.",
        },
        {
          icon: "sciatica",
          title: "Ciática",
          body: "Dolor del nervio ciático y radiculopatía.",
        },
        {
          icon: "shockwave",
          title: "Terapia de ondas de choque",
          body: "Terapia por ondas de presión acústica para tejidos blandos lesionados, cuando esté clínicamente indicada.",
        },
        {
          icon: "mri",
          title: "Interpretación de MRI",
          body: "Revisión e informe de imágenes de la columna.",
        },
      ],
      exploreCta: "Ver todos los servicios",
    },
    approach: {
      heading: "Un camino claro hacia el alivio",
      steps: [
        {
          title: "Solicite una cita",
          body: "Llame a la oficina o envíe una solicitud por nuestro formulario. Los nuevos pacientes son bienvenidos.",
        },
        {
          title: "Evaluación en la oficina",
          body: "Un examen completo y las imágenes necesarias conducen a un diagnóstico preciso.",
        },
        {
          title: "Su plan de cuidado",
          body: "Un plan de tratamiento individualizado y a corto plazo enfocado en aliviar su dolor.",
        },
        {
          title: "Comience el cuidado y siga su progreso",
          body: "Inicie su plan y revise su progreso en cada visita, ajustándolo a medida que mejora.",
        },
      ],
    },
    cta: {
      heading: "¿Listo para comenzar?",
      body: "Solicite una cita y nuestro equipo se comunicará con usted para confirmar su visita.",
      button: "Solicitar una Cita",
    },
  },

  about: {
    metaTitle: "Sobre la Práctica",
    metaDescription:
      "Conozca Clark Spine and Pain Relief y al Dr. James Garabo, DC — atención quiropráctica en Clark, Nueva Jersey desde 1991.",
    heroEyebrow: "Sobre Nuestra Práctica",
    heroTitle: "Nuestra práctica",
    heroSubtitle:
      "Sirviendo a Clark, Nueva Jersey y las comunidades cercanas desde 1991.",
    imageAlt: "Dr. James Garabo de Clark Spine and Pain Relief",
    bio: {
      heading: "Sobre Clark Spine and Pain Relief",
      paragraphs: [
        "Clark Spine and Pain Relief (Garabo Chiropractic Health Center, PC) ha atendido a pacientes en Clark, Nueva Jersey y las comunidades cercanas desde 1991. Bajo la dirección del Dr. James Garabo, DC, la práctica se enfoca en un diagnóstico preciso y un plan de tratamiento claro para cada paciente.",
        "El Dr. Garabo es graduado del Palmer College of Chiropractic y su trabajo abarca el diagnóstico y manejo del dolor mecánico de columna, la interpretación de MRI y la documentación médico-legal.",
        "La oficina brinda atención para el dolor de espalda, la ciática, el dolor de cuello, los dolores de cabeza y el dolor irradiado, con planes de tratamiento diseñados para ser a corto plazo e individualizados.",
      ],
    },
    credentials: {
      heading: "Educación y licencias",
      education: {
        title: "Educación",
        items: [
          {
            main: "Doctor en Quiropráctica",
            sub: "Palmer College of Chiropractic · Davenport, IA · 1988",
          },
          { main: "National Board of Chiropractic Examiners, Parte 1 · 1986", sub: "" },
          { main: "National Board of Chiropractic Examiners, Parte 2 · 1987", sub: "" },
        ],
      },
      licensure: {
        title: "Licencias",
        items: [
          { main: "Licencia de Nueva Jersey #MCO-3710", sub: "Activa" },
          { main: "Licencia de Pensilvania · 1988", sub: "Inactiva" },
          { main: "Licencia de Massachusetts · 1989", sub: "Inactiva" },
        ],
      },
      experience: {
        title: "Experiencia",
        items: [
          {
            main: "Director Clínico — Garabo Chiropractic Health Center, PC",
            sub: "Clark, NJ · 1991 – Presente",
          },
          {
            main: "Doctor Asociado — Delano Family Chiropractic Center",
            sub: "Bloomfield, NJ · 1989 – 1991",
          },
        ],
      },
      affiliations: {
        title: "Seguros y afiliaciones",
        items: [
          { main: "Trauma Qualified", sub: "" },
          { main: "Medicare", sub: "" },
          { main: "Horizon BCBS de Nueva Jersey", sub: "Tier 1" },
          { main: "Hackensack Meridian", sub: "Inner Circle" },
        ],
      },
    },
  },

  services: {
    metaTitle: "Servicios",
    metaDescription:
      "Servicios quiroprácticos en Clark Spine and Pain Relief: atención para el dolor de espalda y cuello, ciática, dolores de cabeza, lesiones por accidentes de auto y diagnóstico en sitio.",
    heroEyebrow: "Lo Que Hacemos",
    heroTitle: "Nuestros servicios",
    heroSubtitle: "Atención quiropráctica integral, bajo un mismo techo.",
    conditionsLabel: "Condiciones que atendemos",
    categories: [
      {
        id: "conditions",
        title: "Condiciones que tratamos",
        description:
          "Desde lesiones agudas hasta condiciones crónicas de la columna, ofrecemos atención específica para diversos diagnósticos musculoesqueléticos.",
        items: [
          {
            icon: "car",
            title: "Lesiones por accidentes de auto",
            body: "Evaluación, tratamiento y documentación de las lesiones por accidentes de vehículo motorizado, incluyendo latigazo y lesiones de disco.",
            conditions: [
              "Latigazo (WAD)",
              "Hernia de disco",
              "Lesiones de tejidos blandos",
              "Radiculopatía por trauma",
            ],
          },
          {
            icon: "spine",
            title: "Dolor de espalda",
            body: "Atención para el dolor de espalda alta, media y baja mediante ajustes quiroprácticos, terapia de tejidos blandos y estrategias de rehabilitación.",
            conditions: [
              "Hernia de disco",
              "Esguince / distensión lumbar",
              "Síndrome facetario",
              "Estenosis espinal",
            ],
          },
          {
            icon: "neck",
            title: "Dolor de cuello",
            body: "Diagnóstico y manejo del dolor mecánico cervical, incluyendo lesiones de latigazo por accidentes de auto.",
            conditions: [
              "Hernia de disco cervical",
              "Latigazo (WAD)",
              "Radiculopatía cervical",
              "Espasmo muscular",
            ],
          },
          {
            icon: "sciatica",
            title: "Ciática",
            body: "Identificación del origen del dolor irradiado en la pierna y creación de un plan de tratamiento específico.",
            conditions: [
              "Hernia de disco lumbar",
              "Síndrome del piriforme",
              "Estenosis espinal",
              "Compresión de raíz nerviosa",
            ],
          },
          {
            icon: "headache",
            title: "Dolores de cabeza",
            body: "Evaluación y manejo conservador de los dolores de cabeza con un componente cervical (relacionado con el cuello).",
            conditions: [
              "Dolores de cabeza cervicogénicos",
              "Dolores de cabeza tensionales",
              "Dolores post-concusión",
            ],
          },
          {
            icon: "nerve",
            title: "Dolor irradiado",
            body: "Atención para el dolor, entumecimiento o debilidad que se irradia de la columna a las extremidades, correlacionando los hallazgos con las imágenes.",
            conditions: [
              "Radiculopatía de extremidad superior",
              "Radiculopatía de extremidad inferior",
            ],
          },
        ],
      },
      {
        id: "treatments",
        title: "Tratamientos y terapias",
        description:
          "Tratamientos prácticos y basados en la evidencia diseñados para aliviar el dolor y apoyar la curación natural del cuerpo.",
        items: [
          {
            icon: "adjustment",
            title: "Manipulación espinal",
            body: "Ajustes quiroprácticos precisos y controlados para restaurar el movimiento articular y reducir el dolor. Las técnicas se adaptan a la condición, edad y comodidad de cada paciente, con opciones de baja fuerza disponibles.",
            conditions: [],
          },
          {
            icon: "shockwave",
            title: "Terapia de ondas de choque",
            body: "La terapia de ondas de choque extracorpórea utiliza ondas de presión acústica para apoyar la curación de los tejidos blandos lesionados. La idoneidad se determina caso por caso.",
            conditions: [],
          },
        ],
      },
      {
        id: "diagnostics",
        title: "Diagnóstico y evaluación",
        description:
          "Capacidades de diagnóstico en la oficina que apoyan un diagnóstico preciso desde su primera visita.",
        items: [
          {
            icon: "xray",
            title: "Rayos X en sitio",
            body: "Imágenes de rayos X digitales realizadas en la oficina para ayudar a identificar desalineaciones espinales, fracturas y cambios estructurales — útiles en evaluaciones tras un accidente.",
            conditions: [],
          },
          {
            icon: "exam",
            title: "Exámenes físicos",
            body: "Un examen físico y neurológico completo — pruebas ortopédicas, evaluación neurológica, rango de movimiento y pruebas de fuerza — antes de comenzar el tratamiento.",
            conditions: [],
          },
          {
            icon: "mri",
            title: "Interpretación de MRI",
            body: "Revisión e interpretación del MRI de columna, correlacionando los hallazgos de las imágenes con los síntomas clínicos, con reportes para casos médico-legales.",
            conditions: [],
          },
        ],
      },
    ],
    cta: {
      heading: "¿Sufre de dolor o se recupera de un accidente?",
      body: "Solicite una cita y le ayudaremos a encontrar un camino hacia el alivio.",
      button: "Solicitar una Cita",
    },
  },

  autoAccidents: {
    metaTitle: "Atención por Lesiones en Accidentes de Auto",
    metaDescription:
      "Atención quiropráctica y documentación de las lesiones por accidentes de vehículo motorizado en Clark, NJ — desde la primera visita hasta la resolución del caso.",
    heroEyebrow: "Atención por Lesiones en Accidentes de Auto",
    heroTitle: "Atención por lesiones en accidentes de auto",
    heroSubtitle:
      "Tratamiento quiropráctico y documentación médico-legal completa — desde la primera visita hasta la resolución del caso.",
    urgency: {
      heading: "Por qué importa la atención temprana",
      subtitle:
        "Los síntomas tras una colisión pueden retrasarse. Una evaluación temprana apoya su salud y cualquier reclamación de seguro o legal.",
      items: [
        {
          icon: "clock",
          title: "Los síntomas suelen retrasarse",
          body: "La adrenalina y la inflamación pueden enmascarar el dolor por días. Una evaluación clínica ayuda a identificar lesiones que aún no son evidentes.",
        },
        {
          icon: "document",
          title: "La documentación empieza temprano",
          body: "Un expediente médico oportuno ayuda a establecer la conexión entre el accidente y sus lesiones.",
        },
        {
          icon: "recovery",
          title: "La atención temprana apoya la recuperación",
          body: "Atender las lesiones espinales temprano puede reducir la probabilidad de problemas a largo plazo.",
        },
      ],
    },
    injuries: {
      heading: "Lesiones comunes en accidentes de auto",
      subtitle:
        "Evaluamos y tratamos diversas lesiones que ocurren tras los accidentes de vehículo motorizado.",
      items: [
        {
          icon: "whiplash",
          title: "Latigazo (WAD)",
          body: "Lesión cervical por aceleración–desaceleración — la lesión más común en accidentes de auto.",
        },
        {
          icon: "disc",
          title: "Hernia de disco",
          body: "Hernia de disco traumática en la columna cervical o lumbar por las fuerzas del impacto.",
        },
        {
          icon: "softtissue",
          title: "Lesiones de tejidos blandos",
          body: "Lesiones de músculos, ligamentos y tendones en toda la columna y las extremidades.",
        },
        {
          icon: "nerve",
          title: "Radiculopatía",
          body: "Compresión de la raíz nerviosa que causa dolor irradiado, entumecimiento o debilidad.",
        },
        {
          icon: "headache",
          title: "Dolores de cabeza post-concusión",
          body: "Dolor de cabeza y cuello tras un trauma craneal o desaceleración brusca.",
        },
        {
          icon: "spine",
          title: "Subluxaciones espinales",
          body: "Desalineaciones vertebrales que afectan el movimiento articular tras un trauma.",
        },
      ],
    },
    process: {
      heading: "Qué esperar como paciente de accidente",
      steps: [
        {
          title: "Programación rápida",
          body: "Llame y lo atenderemos lo antes posible — con frecuencia el mismo día o al día siguiente.",
        },
        {
          title: "Evaluación completa",
          body: "Un examen ortopédico y neurológico completo, incluyendo rayos X en sitio cuando esté clínicamente indicado.",
        },
        {
          title: "Diagnóstico y plan de tratamiento",
          body: "Un diagnóstico preciso y un plan de cuidado enfocado en sus lesiones.",
        },
        {
          title: "Documentación en todo momento",
          body: "Expedientes y reportes médicos completos para su aseguradora, abogado o médico de referencia.",
        },
      ],
    },
    legal: {
      heading: "Documentación para su caso",
      body: "La práctica ha atendido a pacientes de accidentes de auto y a la comunidad legal de Nueva Jersey por más de tres décadas, y entiende lo que las aseguradoras, los abogados y los médicos de referencia necesitan de un proveedor tratante.",
      items: [
        "Reportes de evaluación inicial de lesiones",
        "Reportes médicos narrativos",
        "Reportes de interpretación y datación de MRI",
        "Testimonio experto y deposiciones",
        "Reportes de progreso y estado final",
      ],
    },
    cta: {
      heading: "¿Estuvo en un accidente?",
      body: "Solicite una cita para una evaluación rápida.",
      button: "Solicitar una Cita",
    },
  },

  contact: {
    metaTitle: "Contacto",
    metaDescription:
      "Contacte a Clark Spine and Pain Relief en Clark, Nueva Jersey. Llame al (908) 497-9440 o solicite una cita en línea.",
    heroEyebrow: "Póngase en Contacto",
    heroTitle: "Contáctenos",
    heroSubtitle: "Solicite una cita o comuníquese con la oficina con una pregunta.",
    infoHeading: "Información de la práctica",
    hoursHeading: "Horario de oficina",
    phoneLabel: "Teléfono",
    faxLabel: "Fax",
    addressLabel: "Dirección",
    emergencyNotice:
      "Si tiene una emergencia médica, llame al 911 o acuda a la sala de emergencias más cercana. Por favor, no use este sitio web para reportar una emergencia.",
    officeLabel: "Qué buscar",
    buildingImageAlt: "Letrero exterior de Marcus Plaza que muestra Garabo Chiropractic",
    doorImageAlt: "Entrada principal del consultorio de Garabo Chiropractic",
    viewBuildingPhoto: "Ver una foto ampliada del letrero de Marcus Plaza",
    viewDoorPhoto: "Ver una foto ampliada de la entrada del consultorio",
    lightbox: {
      previous: "Imagen anterior",
      next: "Imagen siguiente",
      close: "Cerrar visor de imágenes",
      counter: "Imagen {current} de {total}",
      dialogLabel: "Fotos de la ubicación del consultorio",
    },
    cta: {
      heading: "Solicite una cita",
      body: "Envíe una solicitud por nuestro formulario seguro y nuestro equipo se comunicará con usted para confirmar su visita.",
      button: "Ir al formulario de citas",
    },
  },

  inquiry: {
    metaTitle: "Solicitar una Cita",
    metaDescription:
      "Solicite una cita con Clark Spine and Pain Relief en Clark, Nueva Jersey mediante nuestro formulario seguro en línea.",
    heroEyebrow: "Solicitar una Cita",
    heroTitle: "Solicite una cita",
    heroSubtitle:
      "Complete el formulario y nuestro equipo se comunicará con usted para confirmar su visita.",
    emergencyNotice:
      "No use este formulario para emergencias médicas ni para compartir detalles médicos sensibles. Si es una emergencia, llame al 911. Enviar este formulario no crea una relación médico–paciente.",
    form: {
      requiredHint: "Los campos obligatorios están marcados con un asterisco (*).",
      optional: "opcional",
      firstName: "Nombre",
      lastName: "Apellido",
      email: "Correo electrónico",
      phone: "Número de teléfono",
      subject: "Asunto",
      message: "Mensaje",
      messageHint: "Cuéntenos brevemente cómo podemos ayudar.",
      submit: "Enviar solicitud",
      submitting: "Enviando…",
      privacyNote: "Usamos su información únicamente para responder a su solicitud.",
      turnstileLabel: "Verificación de seguridad",
      errorSummaryTitle: "Por favor revise el formulario",
      errors: {
        required: "Este campo es obligatorio.",
        invalidName: "Ingrese un nombre válido (letras, espacios, guiones, apóstrofos).",
        invalidEmail: "Ingrese una dirección de correo válida.",
        invalidPhone: "Ingrese un número de teléfono válido.",
        tooLong: "Este valor es demasiado largo.",
        messageTooShort: "Ingrese al menos 10 caracteres.",
        captcha: "Por favor complete la verificación de seguridad.",
        rateLimit: "Espere {seconds} segundos antes de intentar de nuevo.",
        server: "Algo salió mal de nuestro lado. Intente de nuevo o llámenos.",
        network:
          "No pudimos conectar con el servidor. Verifique su conexión e intente de nuevo.",
      },
    },
    thankYou: {
      metaTitle: "Gracias",
      metaDescription: "Su solicitud de cita ha sido recibida.",
      title: "Gracias — recibimos su solicitud",
      body: "Recibimos su solicitud y nos comunicaremos con usted para confirmar su visita. Un correo de confirmación está en camino.",
      emergencyNote:
        "Recuerde: si tiene una emergencia médica, llame al 911 o acuda a la sala de emergencias más cercana.",
      backHome: "Volver al inicio",
      viewServices: "Ver nuestros servicios",
    },
  },

  privacy: {
    navLabel: "Política de Privacidad",
    metaTitle: "Política de Privacidad",
    metaDescription:
      "Cómo Clark Spine and Pain Relief maneja la información enviada a través de este sitio web.",
    title: "Política de Privacidad",
    lastUpdatedLabel: "Última actualización",
    lastUpdated: "Esta política está en revisión y pendiente de aprobación final.",
    intro:
      "Esta Política de Privacidad explica cómo Clark Spine and Pain Relief maneja la información que usted proporciona a través de este sitio web. Se aplica únicamente a este sitio web y no reemplaza el Aviso de Prácticas de Privacidad que la práctica entrega a sus pacientes.",
    sections: [
      {
        heading: "Información que recopilamos",
        body: [
          "Cuando usa el formulario de solicitud de cita, recopilamos la información que usted decide enviar: su nombre, dirección de correo electrónico, un número de teléfono opcional, un asunto y su mensaje.",
          "Por favor, no envíe información médica sensible ni detalles de una emergencia médica a través de este sitio web.",
        ],
      },
      {
        heading: "Cómo usamos su información",
        body: [
          "Usamos la información que usted envía únicamente para responder a su solicitud y para comunicarnos con usted sobre su consulta.",
          "No vendemos su información ni la usamos para publicidad.",
        ],
      },
      {
        heading: "Proveedores de servicios",
        body: [
          "Usamos servicios externos de confianza para operar el formulario: un proveedor de entrega de correo para enviar su mensaje a la oficina, un servicio de seguridad para ayudar a prevenir el abuso automatizado y un servicio de límite de solicitudes para proteger el formulario. Estos proveedores procesan información técnica limitada en nuestro nombre.",
        ],
      },
      {
        heading: "Retención de datos",
        body: [
          "Los mensajes de consulta son conservados por la oficina solo durante el tiempo necesario para responder y gestionar su solicitud.",
        ],
      },
      {
        heading: "Contacto",
        body: [
          "Para preguntas sobre esta política o sobre la información que envió a través de este sitio web, comuníquese con la oficina por teléfono.",
        ],
      },
    ],
  },

  notFound: {
    title: "Página no encontrada",
    body: "Lo sentimos, no pudimos encontrar la página que buscaba.",
    cta: "Ir a la página de inicio",
  },
};

export default es;

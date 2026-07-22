// data.js — content for the v5 site.
// Adding a project = adding an entry to PROJECTS. Order here is the order
// everywhere: gallery, index list, and prev/next.
//
// Layout note: the gallery is a 3-column grid (see .grid in styles.css); with
// 4 projects the 4th starts a second row. The detail view pins each project's
// plates to one of 3 columns via projectIndex % COLS (app.js); the 4th reuses
// column 0, which is fine since you only ever see one detail at a time.

const COVER_FALLBACK = 'Images/Projects/Desktop_01.png';

const PROJECTS = [
  {
    key: 'manon',
    idxTitle: 'manon guilbert',
    date: '2025',
    category: 'Brand · UI · Web',
    cover: 'Images/Projects/Desktop_01.png',
    coverFit: 'cover',
    // Walkthrough of the V3 site. Mobile screens are composited three-per-board
    // (like Rione); the deck opens on one. Shakira / Georgia Palmer / Amber
    // Valletta shoots removed. `ar` (width/height) fills each plate.
    slides: [
      { img: 'Images/Projects/Guilbert/guilbert-mboard-1.png', ar: 1.500 }, // mobile board — home · about · Gosling
      { img: 'Images/Projects/Guilbert/guilbert-home-d.png',   ar: 1.756 }, // home
      { img: 'Images/Projects/Guilbert/guilbert-about.png',    ar: 1.779 }, // about
      { img: 'Images/Projects/Guilbert/guilbert-archive.png',  ar: 1.779 }, // archive — full body of work (overview)
      { img: 'Images/Projects/Guilbert/guilbert-shoot-01.png', ar: 1.779 }, // WSJ x Ryan Gosling
      { img: 'Images/Projects/Guilbert/guilbert-shoot-02.png', ar: 1.779 }, // Vogue HK x Anya Taylor Joy
      { img: 'Images/Projects/Guilbert/guilbert-shoot-03.png', ar: 1.779 }, // WSJ x Oaxaca
      { img: 'Images/Projects/Guilbert/guilbert-shoot-04.png', ar: 1.779 }, // Muse x Amber Valletta
      { img: 'Images/Projects/Guilbert/guilbert-shoot-06.png', ar: 1.779 }, // Vogue HK x Rory Van Millingen
      { img: 'Images/Projects/Guilbert/guilbert-shoot-07.png', ar: 1.779 }, // Vogue HK x Felix Cooper
      { img: 'Images/Projects/Guilbert/guilbert-shoot-10.png', ar: 1.779 }, // Elle US x Sora Choi
      { img: 'Images/Projects/Guilbert/guilbert-shoot-11.png', ar: 1.779 }, // Marle Magazine
      { img: 'Images/Projects/Guilbert/guilbert-shoot-12.png', ar: 1.779 }  // Dom Pérignon
    ],
    en: {
      c1t: 'Briefing',
      c1: ['Manon Guilbert is a Paris-based creative producer moving between fashion styling, photo and video production. The brief was to design her first portfolio — a site that could hold a fast, editorial body of work while still reading as personal, and gather her studies, experience and productions in one coherent place.'],
      c2t: 'Concept',
      c2: [
        'The concept treats the portfolio as an editorial dossier: a light serif for voice, a monospace for the credits and dates that structure her world, and a loose collage of shoots that behaves like a working moodboard.',
        'Each image opens to reveal its production credits, so the layout stays quiet on the surface and turns detailed on demand — mirroring the way Manon works, in layers and in collaboration.'
      ]
    },
    fr: {
      c1t: 'Brief',
      c1: ["Manon Guilbert est une productrice créative basée à Paris, entre stylisme de mode, production photo et vidéo. Le brief consistait à concevoir son premier portfolio — un site capable d'accueillir un corpus éditorial et rapide tout en restant personnel, et de réunir ses études, son expérience et ses productions en un lieu cohérent."],
      c2t: 'Concept',
      c2: [
        'Le concept traite le portfolio comme un dossier éditorial : un serif léger pour la voix, une monospace pour les crédits et les dates qui structurent son univers, et un collage libre de shootings qui fonctionne comme un moodboard de travail.',
        "Chaque image s'ouvre pour révéler ses crédits de production : la mise en page reste sobre en surface et devient détaillée à la demande — à l'image de la façon dont Manon travaille, en strates et en collaboration."
      ]
    }
  },
  {
    key: 'grammaroli',
    idxTitle: 'grammaroli',
    date: '2020',
    category: 'Brand Identity · UI',
    cover: 'Images/Projects/Grammaroli/Grammaroli_02.png',
    coverFit: 'contain',
    galleryCover: 'Images/Projects/Desktop_02.png',
    // README calls for Desktop_04.gif, which is not in the repo.
    // Desktop_02.gif is the animated Grammaroli site — same source.
    hoverGif: 'Images/Projects/Desktop_02.gif',
    slides: [
      { img: 'Images/Projects/Grammaroli/Grammaroli_02.png', r: 1.606 },
      { img: 'Images/Projects/Grammaroli/Grammaroli_03.png', r: 1.325 },
      { img: 'Images/Projects/Grammaroli/Grammaroli_04.png', r: 0.667 },
      { img: 'Images/Projects/Grammaroli/Grammaroli_05.png', r: 1.606 },
      { img: 'Images/Projects/Grammaroli/Grammaroli_07.png', r: 1.606 }
    ],
    en: {
      c1t: 'Briefing',
      c1: ['The following project consisted in the rebranding, copywriting and website design of Grammaroli, an italian artisan business specialized in the processing of marble, with its headquarters and laboratory in Rome, Via dei Reti, 21.'],
      c2t: 'Concept',
      c2: ['The concept had the aim of emphasizing the primordial role of the material in making Rome the capital of the world through its art: “Rome caput mundi, Grammaroli caput Rome”. For its realization, the elegance and classicism of Roman sculptures blend with a modern typography to give rise to the new image of Grammaroli.']
    },
    fr: {
      c1t: 'Brief',
      c1: ["Ce projet a consisté en le rebranding, la rédaction et la conception du site web de Grammaroli, une entreprise artisanale italienne spécialisée dans le travail du marbre, dont le siège et l'atelier se trouvent à Rome, Via dei Reti, 21."],
      c2t: 'Concept',
      c2: ['Le concept avait pour objectif de mettre en valeur le rôle primordial du matériau dans la construction de Rome comme capitale du monde à travers son art : « Rome caput mundi, Grammaroli caput Rome ». Pour sa réalisation, l\'élégance et le classicisme des sculptures romaines se mêlent à une typographie moderne pour donner naissance à la nouvelle image de Grammaroli.']
    }
  },
  {
    key: 'pasaporte',
    idxTitle: 'pasaporte',
    date: '2022',
    category: 'Editorial · UI Design',
    cover: 'Images/Projects/Desktop_03.png',
    coverFit: 'cover',
    slides: [
      { img: 'Images/Projects/Pasaporte/Pasaporte_01.png', r: 1.497 },
      { img: 'Images/Projects/Pasaporte/Pasaporte_02.png', r: 1.393 },
      { img: 'Images/Projects/Pasaporte/Pasaporte_05.png', r: 1.072 },
      { img: 'Images/Projects/Pasaporte/Pasaporte_06.png', r: 1.191 }
    ],
    en: {
      c1t: 'Briefing',
      c1: ['The following Editorial Design briefing consisted in the ideation of a concept & design of a hypothetical newspaper that would address metropolitan issues.'],
      c2t: 'Concept',
      c2: [
        'My solution was Pasaporte, a newspaper that was born with the intention of gathering the iconographic repertoire of cities. Pasaporte aims to outline and motivate the origins and consequences behind some of the mental images that are universally and, often unconsciously, linked to some regions.',
        'Starting from this idea, an inserted Magazine was designed in order to serve as an in-depth study of one territory through the work of photographers that capture the iconographic repertoire of the place.'
      ]
    },
    fr: {
      c1t: 'Brief',
      c1: ["Ce brief de Design Éditorial consistait en l'idéation d'un concept et du design d'un journal hypothétique qui aborderait les questions métropolitaines."],
      c2t: 'Concept',
      c2: [
        "Ma solution était Pasaporte, un journal né avec l'intention de rassembler le répertoire iconographique des villes. Pasaporte vise à esquisser et motiver les origines et les conséquences derrière certaines des images mentales liées à certaines régions.",
        "À partir de cette idée, un Magazine inséré a été conçu pour servir d'étude approfondie d'un territoire à travers le travail de photographes."
      ]
    }
  },
  {
    key: 'rione',
    idxTitle: 'rione monti',
    date: '2024',
    category: 'Brand Identity · UI/UX',
    // Usual detail layout. Opens on the desktop hero, then alternates desktop
    // and mobile boards (Frames_02). `ar` (width/height) shapes each plate so
    // the landscape frame fills it.
    cover: 'Images/Projects/Rione/rione-cover.png',
    coverFit: 'cover',
    slides: [
      { img: 'Images/Projects/Rione/rione-d-hero.png', ar: 1.600, pad: true }, // desktop — hero (raw screenshot, keep border)
      { img: 'Images/Projects/Rione/rione-b1.png',     ar: 1.564 }, // mobile
      { img: 'Images/Projects/Rione/rione-b4.png',     ar: 1.564 }, // desktop — à propos
      { img: 'Images/Projects/Rione/rione-b2.png',     ar: 1.564 }, // mobile
      { img: 'Images/Projects/Rione/rione-b5.png',     ar: 1.564 }, // desktop — notre début
      { img: 'Images/Projects/Rione/rione-b3.png',     ar: 1.564 }, // mobile
      { img: 'Images/Projects/Rione/rione-b6.png',     ar: 1.564 }, // desktop — menus
      { img: 'Images/Projects/Rione/rione-b7.png',     ar: 1.564 }  // desktop — témoignages
    ],
    en: {
      c1t: 'Briefing',
      c1: ['Rione Monti is a Paris-based Italian catering service specializing in authentic Roman cuisine. The brief called for a complete brand identity and digital presence that would convey the warmth of Italian hospitality while appealing to a French audience.'],
      c2t: 'Concept',
      c2: ['The visual identity draws from the rich iconography of Roman neighborhoods—the rioni. A warm terracotta palette paired with classical illustrations creates an inviting yet refined aesthetic. The design system extends across menus, social media, and print materials, balancing tradition with contemporary sensibility.']
    },
    fr: {
      c1t: 'Brief',
      c1: ["Rione Monti est un service de traiteur italien basé à Paris, spécialisé dans la cuisine romaine authentique. Le brief demandait une identité de marque complète et une présence digitale qui transmettrait la chaleur de l'hospitalité italienne tout en séduisant un public français."],
      c2t: 'Concept',
      c2: ["L'identité visuelle s'inspire de la riche iconographie des quartiers romains — les rioni. Une palette de terracotta chaude associée à des illustrations classiques crée une esthétique accueillante mais raffinée. Le système de design s'étend aux menus, aux réseaux sociaux et aux supports imprimés, équilibrant tradition et sensibilité contemporaine."]
    }
  }
];

// The roles the typewriter cycles through on the home line. Left untranslated
// on purpose — the design reference hardcodes them in English for both
// languages, since they read as job titles rather than prose.
const ROLES = [
  'Graphic Designer.',
  'UI Designer.',
  'Identity Designer.',
  'Creative Developer.'
];

// Fixed left rail.
const RAIL = {
  place: 'Paris France',
  coords: '48.8566° N  2.3522° E',
  timezone: 'Europe/Paris',
  timeSuffix: ' CET'
};

// Links out of the About column.
const LINKS = {
  rufa: 'https://www.unirufa.it/en/',
  esad: 'https://esad.pt/en',
  vacarme: 'https://studiovacarme.com/'
};

const I18N = {
  en: {
    navAbout: 'About',
    navProjects: 'Projects',
    tagline: 'Freelance Designer — Art Direction, Brand, Web',

    introLead: 'Let me introduce myself. I am Caterina and I am a',
    introP2: 'A constant back-and-forth between Venezuela, Portugal, and Italy shaped my love for multiculturalism, communication, and art.',
    introP3: 'This passion led me to pursue a Bachelor in Graphic Design at the Rome University of Fine Arts (2018–2021).',
    introP4: 'I am currently based in Paris.',

    servicesTitle: 'Services',
    svcWebDev: 'Web Development',
    svcWebDesign: 'Web Design',
    svcUiux: 'UI Design',
    svcBrand: 'Brand Design',
    svcEditorial: 'Editorial Design',

    contactTitle: 'Contact',

    languagesTitle: 'Languages',
    lang1: 'Italian',
    lang2: 'Spanish',
    lang3: 'English',
    lang4: 'French',

    educationTitle: 'Education',
    edu1a: 'Bachelor in Graphic Design',
    edu1b: 'Rome University of Fine Arts (RUFA)',
    edu1c: '2018 to 2022',
    edu2a: 'Erasmus in Communication Design',
    edu2b: 'ESAD Porto',
    edu2c: '2021',

    experienceTitle: 'Experience',
    openToWork: 'Open to work',
    exp1a: 'Freelance Designer',
    exp1b: 'Paris, since 2021',
    expIntern: 'Graphic Design Intern',
    exp2b: 'Paris, 2022 to 2023',
    exp3b: 'Porto, 2021 to 2022',

    copyright: '© 2026 Caterina Tahan.',
    rights: 'All rights reserved.'
  },
  fr: {
    navAbout: 'À propos',
    navProjects: 'Projets',
    tagline: 'Freelance Designer — Art Direction, Brand, Web',

    introLead: 'Laissez-moi me présenter. Je suis Caterina et je suis',
    introP2: "Un va-et-vient constant entre le Venezuela, le Portugal et l'Italie a façonné mon amour pour le multiculturalisme, la communication et l'art.",
    introP3: 'Cette passion m’a menée vers une Licence en Design Graphique à la Rome University of Fine Arts (2018–2021).',
    introP4: 'Je suis actuellement basée à Paris.',

    servicesTitle: 'Services',
    svcWebDev: 'Développement Web',
    svcWebDesign: 'Design Web',
    svcUiux: 'Design UI',
    svcBrand: 'Design de Marque',
    svcEditorial: 'Design Éditorial',

    contactTitle: 'Contact',

    languagesTitle: 'Langues',
    lang1: 'Italien',
    lang2: 'Espagnol',
    lang3: 'Anglais',
    lang4: 'Français',

    educationTitle: 'Formation',
    edu1a: 'Licence en Design Graphique',
    edu1b: 'Rome University of Fine Arts (RUFA)',
    edu1c: '2018 à 2022',
    edu2a: 'Erasmus en Design de Communication',
    edu2b: 'ESAD Porto',
    edu2c: '2021',

    experienceTitle: 'Expérience',
    openToWork: 'Disponible',
    exp1a: 'Designer Freelance',
    exp1b: 'Paris, depuis 2021',
    expIntern: 'Stagiaire en Design Graphique',
    exp2b: 'Paris, 2022 à 2023',
    exp3b: 'Porto, 2021 à 2022',

    copyright: '© 2026 Caterina Tahan.',
    rights: 'Tous droits réservés.'
  }
};

// Language proficiency: filled dots out of four.
const LANGUAGES = [
  { key: 'lang1', level: 4 },
  { key: 'lang2', level: 4 },
  { key: 'lang3', level: 4 },
  { key: 'lang4', level: 3 }
];

const CONTACT = {
  email: 'ccaterinatahan@gmail.com',
  phone: '+33 07 45 1010 83',
  instagram: 'https://instagram.com/caterinatahan',
  linkedin: 'https://linkedin.com/in/caterinatahan'
};

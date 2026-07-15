// data.js — content for the v5 site.
// Adding a project = adding an entry to PROJECTS. Order here is the order
// everywhere: gallery, index list, and prev/next.
//
// Layout note: the detail view pins each project to its own column of a
// 3-column grid (see COLS in app.js). Past 3 projects that rule needs a
// design answer — a 4th project currently wraps to column 1 of a second row.

const COVER_FALLBACK = 'Images/Projects/Desktop_01.png';

const PROJECTS = [
  {
    key: 'manon',
    idxTitle: 'manon guilbert',
    date: '2025',
    category: 'Brand · UI · Web',
    cover: 'Images/Projects/Desktop_01.png',
    coverFit: 'cover',
    // Renamed from the README's frame1/frame2/frame3 — these are the same
    // full-page screenshots of Manon's site, as shipped in this repo.
    slides: [
      { img: 'Images/Projects/Guilbert/desktop1.jpg' },
      { img: 'Images/Projects/Guilbert/desktop2.jpg' },
      { img: 'Images/Projects/Guilbert/mobile.png' }
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
    category: 'Brand Identity · UI/UX',
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
  }
];

// Cursor-trail scraps for the home screen.
const TRAIL_IMAGES = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27,
  28, 29, 30, 31, 32, 33, 34, 35, 36, 38, 39, 40, 41, 42, 43, 47]
  .map(n => `Images/Gallery/Group ${n}.png`);

const I18N = {
  en: {
    navAbout: 'About',
    navProjects: 'Projects',
    tagline: 'Freelance Designer — Art Direction, Brand, Web',
    centerText: 'Now you know me.',
    clickWord: 'Click',
    clickMore: ' to know more.',
    drawPrompt: 'Draw here.',
    aboutIntro1: 'Let me introduce myself. I am Caterina and I am a Digital Designer. A constant back-and-forth between Venezuela, Portugal, and Italy shaped my love for multiculturalism, communication, and art, a passion that led me to pursue a Bachelor in Graphic Design at the Rome University of Fine Arts (2018–2021).',
    aboutIntro2: 'I am currently based in Paris.',
    servicesTitle: 'Services',
    svcCreative: 'Creative Development',
    svcUiux: 'UI/UX Design',
    svcBrand: 'Brand Design',
    svcEditorial: 'Editorial Design',
    contactTitle: 'Contact',
    copyright: '© 2025 Caterina Tahan.',
    rights: 'All rights reserved.'
  },
  fr: {
    navAbout: 'À propos',
    navProjects: 'Projets',
    tagline: 'Freelance Designer — Art Direction, Brand, Web',
    centerText: 'Maintenant vous me connaissez.',
    clickWord: 'Cliquez',
    clickMore: ' pour en savoir plus.',
    drawPrompt: 'Dessinez ici.',
    aboutIntro1: "Je suis Caterina, Designer Digital. Entre le Venezuela, le Portugal et l'Italie, j'ai développé un amour pour le multiculturalisme, la communication et l'art — une passion qui m'a menée vers une Licence en Design Graphique à l'Académie des Beaux-Arts de Rome (2018–2021).",
    aboutIntro2: 'Je suis actuellement basée à Paris.',
    servicesTitle: 'Services',
    svcCreative: 'Développement Créatif',
    svcUiux: 'Design UI/UX',
    svcBrand: 'Design de Marque',
    svcEditorial: 'Design Éditorial',
    contactTitle: 'Contact',
    copyright: '© 2025 Caterina Tahan.',
    rights: 'Tous droits réservés.'
  }
};

const CONTACT = {
  email: 'ccaterinatahan@gmail.com',
  phone: '+33 07 45 1010 83',
  instagram: 'https://instagram.com/caterinatahan',
  linkedin: 'https://linkedin.com/in/caterinatahan'
};

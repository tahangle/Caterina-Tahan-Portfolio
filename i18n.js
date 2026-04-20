// i18n.js - Internationalization for Caterina Tahan Portfolio
(function() {
    const STORAGE_KEY = 'portfolio_language';
    const DEFAULT_LANG = 'en';
    const SUPPORTED_LANGS = ['en', 'fr'];

    // Embedded translations (no fetch required)
    const translations = {
        en: {
            nav: {
                about: "About",
                projects: "Projects",
                contact: "Contact"
            },
            footer: {
                copyright: "© 2025 Caterina Tahan.",
                rights: "All rights reserved."
            },
            home: {
                drawPrompt: "draw here",
                centerText: "now you know me.",
                clickMore: '<span class="bold-text">click</span> to know more'
            },
            about: {
                intro1: "Let me introduce myself. I am Caterina and I am a Digital Designer. A constant back-and-forth between Venezuela, Portugal, and Italy shaped my love for multiculturalism, communication, and art, a passion that led me to pursue a Bachelor in Graphic Design at the Rome University of Fine Arts (2018–2021).",
                intro2: "I am currently based in Paris.",
                servicesTitle: "Services",
                services: {
                    creative: "Creative Development",
                    uiux: "UI/UX Design",
                    brand: "Brand Design",
                    editorial: "Editorial Design"
                },
                contactTitle: "Contact",
                socialsTitle: "Socials"
            },
            contact: {
                intro: "Let's work together. Feel free to reach out for collaborations, inquiries, or just to say hello.",
                contactTitle: "Contact",
                socialsTitle: "Socials",
                basedTitle: "Based in",
                based: "Paris, France"
            },
            projects: {
                slideshowView: "Slideshow view",
                gridView: "Grid view"
            },
            projectMeta: {
                grammaroli: { title: "Grammaroli", meta: "2020, Brand Identity & UI/UX" },
                sentient: { title: "Sentient", meta: "2022, Brand Identity & UI/UX" },
                anatomy: { title: "The Anatomy of Portuguese Melancholy", meta: "2022, Editorial Design" },
                stampa: { title: "Calendar Freedom of Press", meta: "2022, Editorial Design" },
                rione: { title: "Rione Monti", meta: "2024, Brand Identity & UI/UX" },
                pasaporte: { title: "Pasaporte", meta: "2022, Editorial & UI Design" }
            },
            projectDetails: {
                grammaroli: {
                    title: "Grammaroli.",
                    meta: "2020. Brand Identity & UI/UX.",
                    briefingTitle: "BRIEFING",
                    briefing: "The following project consisted in the rebranding, copywriting and website design of Grammaroli, an italian artisan business specialized in the processing of marble, with its headquarters and laboratory in Rome, Via dei Reti, 21.",
                    conceptTitle: "CONCEPT",
                    concept: "The concept had the aim of emphasizing the primordial role of the material in making Rome the capital of the world through its art: \"Rome caput mundi, Grammaroli caput Rome\". For its realization, the elegance and classicism of Roman sculptures blend with a modern typography to give rise to the new image of Grammaroli."
                },
                sentient: {
                    title: "Sentient.",
                    meta: "2022. Brand Identity & UI/UX.",
                    briefingTitle: "BRIEFING",
                    briefing: "Sentient is a mobile application designed to educate users on gender issues through an intuitive interface and video call features. The project was developed as a university project abroad at Escola Superior de Artes e Design.",
                    conceptTitle: "CONCEPT",
                    concept: "The design emphasizes empathy through a gender neutral aesthetic and bold typography. The application creates a safe space for learning and discussion, allowing users to connect with educators and experts on gender-related topics through seamless video communication."
                },
                anatomy: {
                    title: "The Anatomy of Portuguese Melancholy.",
                    meta: "2022. Editorial Design.",
                    overviewTitle: "OVERVIEW",
                    overview1: "This project served as the culmination of my undergraduate studies at Rome University of Fine Arts, with minimal constraints beyond reflecting personal interests and academic growth.",
                    overview2: "Following a year abroad in Porto, the research focused on understanding the cultural roots of Portuguese melancholia, examining myths, memories, and culture to understand how a nation's past influences its present identity and character.",
                    conceptTitle: "CONCEPT",
                    concept1: "The identity is an image in which the present dominates the scene, but the past dictates the destiny.",
                    concept2: "This exploration delves into how national identity is shaped by historical and cultural elements, tracing the threads of melancholy that weave through Portuguese culture and examining how these emotional undercurrents define a collective character across generations."
                },
                stampa: {
                    title: "Calendar \"Freedom of Press\".",
                    meta: "2022. Editorial Design.",
                    briefingTitle: "BRIEFING",
                    briefing: "The Tipografare annual contest requested participants design a calendar addressing \"print\" with minimal constraints beyond format requirements, allowing creative interpretation freedom.",
                    conceptTitle: "CONCEPT",
                    concept1: "The designer expanded beyond typical print-related imagery. Drawing inspiration from Gustave Flaubert's perspective on censorship, the project explores \"Libertà di Stampa\" (Freedom of the Press) by representing censorship as an attack on the human mind.",
                    concept2: "The execution employed unconventional materials and everyday papers to simulate analog techniques predating modern printing, including letterpress, Decadry, and collage methods. The project received second-place recognition in the competition."
                },
                rione: {
                    title: "Rione Monti.",
                    meta: "2024. Brand Identity & UI/UX.",
                    briefingTitle: "BRIEFING",
                    briefing: "Rione Monti is a Paris-based Italian catering service specializing in authentic Roman cuisine. The brief called for a complete brand identity and digital presence that would convey the warmth of Italian hospitality while appealing to a French audience.",
                    conceptTitle: "CONCEPT",
                    concept: "The visual identity draws from the rich iconography of Roman neighborhoods—the rioni. A warm terracotta palette paired with classical illustrations creates an inviting yet refined aesthetic. The design system extends across menus, social media, and print materials, balancing tradition with contemporary sensibility."
                },
                pasaporte: {
                    title: "Pasaporte.",
                    meta: "2022. Editorial Design and UI Design.",
                    briefingTitle: "BRIEFING",
                    briefing: "The following Editorial Design briefing consisted in the ideation of a concept & design of a hypothetical newspaper that would address metropolitan issues.",
                    conceptTitle: "CONCEPT",
                    concept1: "My solution was Pasaporte, a newspaper that was born with the intention of gathering the iconographic repertoire of cities. Pasaporte aims to outline and motivate the origins and consequences behind some of the mental images that are universally and, often unconsciously, linked to some regions.",
                    concept2: "Starting from this idea, an inserted Magazine was designed in order to serve as an in-depth study of one territory through the work of photographers that capture the iconographic repertoire of the place. Leandro Colantoni's shots of the Sicilian territory, Juan Brenner's representations of Mexican religious iconography and the reflection of the margins of the American dream from the lens of Bryan Schutmaat; these are just some of the inspirations on which the project was built."
                },
                carthusia: {
                    title: "Carthusia. Jackie 'O Special Edition.",
                    meta: "2020. Brand Identity & Packaging Design.",
                    briefingTitle: "BRIEFING",
                    briefing: "This project involved designing luxury perfume packaging for Carthusia, a prestigious fragrance brand. The design was created for the One More Pack 2020 contest.",
                    conceptTitle: "CONCEPT",
                    concept: "The packaging design is inspired by Jacqueline Onassis's artistic sensibility and timeless elegance. The special edition captures the essence of sophistication and classic beauty that defined Jackie O's iconic style, translating these qualities into a luxurious unboxing experience."
                },
                manonGuilbert: {
                    title: "Manon Guilbert Portfolio.",
                    meta: "2025. Brand Identity, UI Design and Web Development.",
                    briefingTitle: "BRIEFING",
                    briefing: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                    conceptTitle: "CONCEPT",
                    concept1: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                    concept2: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo."
                }
            }
        },
        fr: {
            nav: {
                about: "À propos",
                projects: "Projets",
                contact: "Contact"
            },
            footer: {
                copyright: "© 2025 Caterina Tahan.",
                rights: "Tous droits réservés."
            },
            home: {
                drawPrompt: "dessinez ici",
                centerText: "maintenant vous me connaissez.",
                clickMore: '<span class="bold-text">cliquez</span> pour en savoir plus'
            },
            about: {
                intro1: "Je suis Caterina, Designer Digital. Entre le Venezuela, le Portugal et l'Italie, j'ai développé un amour pour le multiculturalisme, la communication et l'art — une passion qui m'a menée vers une Licence en Design Graphique à l'Académie des Beaux-Arts de Rome (2018–2021).",
                intro2: "Je suis actuellement basée à Paris.",
                servicesTitle: "Services",
                services: {
                    creative: "Développement Créatif",
                    uiux: "Design UI/UX",
                    brand: "Design de Marque",
                    editorial: "Design Éditorial"
                },
                contactTitle: "Contact",
                socialsTitle: "Réseaux"
            },
            contact: {
                intro: "Travaillons ensemble. N'hésitez pas à me contacter pour des collaborations, des questions, ou simplement pour dire bonjour.",
                contactTitle: "Contact",
                socialsTitle: "Réseaux",
                basedTitle: "Basée à",
                based: "Paris, France"
            },
            projects: {
                slideshowView: "Vue diaporama",
                gridView: "Vue grille"
            },
            projectMeta: {
                grammaroli: { title: "Grammaroli", meta: "2020, Identité de Marque & UI/UX" },
                sentient: { title: "Sentient", meta: "2022, Identité de Marque & UI/UX" },
                anatomy: { title: "L'Anatomie de la Mélancolie Portugaise", meta: "2022, Design Éditorial" },
                stampa: { title: "Calendrier Liberté de la Presse", meta: "2022, Design Éditorial" },
                rione: { title: "Rione Monti", meta: "2024, Identité de Marque & UI/UX" },
                pasaporte: { title: "Pasaporte", meta: "2022, Design Éditorial & UI" }
            },
            projectDetails: {
                grammaroli: {
                    title: "Grammaroli.",
                    meta: "2020. Identité de Marque & UI/UX.",
                    briefingTitle: "BRIEF",
                    briefing: "Ce projet a consisté en le rebranding, la rédaction et la conception du site web de Grammaroli, une entreprise artisanale italienne spécialisée dans le travail du marbre, dont le siège et l'atelier se trouvent à Rome, Via dei Reti, 21.",
                    conceptTitle: "CONCEPT",
                    concept: "Le concept avait pour objectif de mettre en valeur le rôle primordial du matériau dans la construction de Rome comme capitale du monde à travers son art : « Rome caput mundi, Grammaroli caput Rome ». Pour sa réalisation, l'élégance et le classicisme des sculptures romaines se mêlent à une typographie moderne pour donner naissance à la nouvelle image de Grammaroli."
                },
                sentient: {
                    title: "Sentient.",
                    meta: "2022. Identité de Marque & UI/UX.",
                    briefingTitle: "BRIEF",
                    briefing: "Sentient est une application mobile conçue pour sensibiliser les utilisateurs aux questions de genre à travers une interface intuitive et des fonctionnalités d'appel vidéo. Le projet a été développé dans le cadre d'un projet universitaire à l'étranger à l'Escola Superior de Artes e Design.",
                    conceptTitle: "CONCEPT",
                    concept: "Le design met l'accent sur l'empathie à travers une esthétique non-genrée et une typographie audacieuse. L'application crée un espace sécurisé pour l'apprentissage et la discussion, permettant aux utilisateurs de se connecter avec des éducateurs et des experts sur des sujets liés au genre grâce à une communication vidéo fluide."
                },
                anatomy: {
                    title: "L'Anatomie de la Mélancolie Portugaise.",
                    meta: "2022. Design Éditorial.",
                    overviewTitle: "APERÇU",
                    overview1: "Ce projet a constitué l'aboutissement de mes études de premier cycle à l'Académie des Beaux-Arts de Rome, avec des contraintes minimales au-delà de la réflexion sur les intérêts personnels et la croissance académique.",
                    overview2: "Suite à une année à l'étranger à Porto, la recherche s'est concentrée sur la compréhension des racines culturelles de la mélancolie portugaise, examinant les mythes, les mémoires et la culture pour comprendre comment le passé d'une nation influence son identité et son caractère présents.",
                    conceptTitle: "CONCEPT",
                    concept1: "L'identité est une image dans laquelle le présent domine la scène, mais le passé dicte le destin.",
                    concept2: "Cette exploration plonge dans la façon dont l'identité nationale est façonnée par des éléments historiques et culturels, retraçant les fils de mélancolie qui tissent la culture portugaise et examinant comment ces courants émotionnels souterrains définissent un caractère collectif à travers les générations."
                },
                stampa: {
                    title: "Calendrier « Liberté de la Presse ».",
                    meta: "2022. Design Éditorial.",
                    briefingTitle: "BRIEF",
                    briefing: "Le concours annuel Tipografare demandait aux participants de concevoir un calendrier abordant le thème de « l'imprimé » avec des contraintes minimales au-delà des exigences de format, permettant une liberté d'interprétation créative.",
                    conceptTitle: "CONCEPT",
                    concept1: "La designer est allée au-delà de l'imagerie typique liée à l'imprimé. S'inspirant de la perspective de Gustave Flaubert sur la censure, le projet explore « Libertà di Stampa » (Liberté de la Presse) en représentant la censure comme une attaque contre l'esprit humain.",
                    concept2: "L'exécution a utilisé des matériaux non conventionnels et des papiers du quotidien pour simuler des techniques analogiques antérieures à l'imprimerie moderne, notamment la typographie, le Decadry et les méthodes de collage. Le projet a reçu la deuxième place dans la compétition."
                },
                rione: {
                    title: "Rione Monti.",
                    meta: "2024. Identité de Marque & UI/UX.",
                    briefingTitle: "BRIEF",
                    briefing: "Rione Monti est un service de traiteur italien basé à Paris, spécialisé dans la cuisine romaine authentique. Le brief demandait une identité de marque complète et une présence digitale qui transmettrait la chaleur de l'hospitalité italienne tout en séduisant un public français.",
                    conceptTitle: "CONCEPT",
                    concept: "L'identité visuelle s'inspire de la riche iconographie des quartiers romains — les rioni. Une palette de terracotta chaude associée à des illustrations classiques crée une esthétique accueillante mais raffinée. Le système de design s'étend aux menus, aux réseaux sociaux et aux supports imprimés, équilibrant tradition et sensibilité contemporaine."
                },
                pasaporte: {
                    title: "Pasaporte.",
                    meta: "2022. Design Éditorial et Design UI.",
                    briefingTitle: "BRIEF",
                    briefing: "Ce brief de Design Éditorial consistait en l'idéation d'un concept et du design d'un journal hypothétique qui aborderait les questions métropolitaines.",
                    conceptTitle: "CONCEPT",
                    concept1: "Ma solution était Pasaporte, un journal né avec l'intention de rassembler le répertoire iconographique des villes. Pasaporte vise à esquisser et motiver les origines et les conséquences derrière certaines des images mentales qui sont universellement et, souvent inconsciemment, liées à certaines régions.",
                    concept2: "À partir de cette idée, un Magazine inséré a été conçu pour servir d'étude approfondie d'un territoire à travers le travail de photographes qui capturent le répertoire iconographique du lieu. Les clichés de Leandro Colantoni du territoire sicilien, les représentations de l'iconographie religieuse mexicaine par Juan Brenner et la réflexion sur les marges du rêve américain à travers l'objectif de Bryan Schutmaat ; ce ne sont là que quelques-unes des inspirations sur lesquelles le projet a été construit."
                },
                carthusia: {
                    title: "Carthusia. Édition Spéciale Jackie 'O.",
                    meta: "2020. Identité de Marque & Design Packaging.",
                    briefingTitle: "BRIEF",
                    briefing: "Ce projet consistait à concevoir un packaging de parfum de luxe pour Carthusia, une marque de parfums prestigieuse. Le design a été créé pour le concours One More Pack 2020.",
                    conceptTitle: "CONCEPT",
                    concept: "Le design du packaging s'inspire de la sensibilité artistique et de l'élégance intemporelle de Jacqueline Onassis. L'édition spéciale capture l'essence de la sophistication et de la beauté classique qui définissaient le style iconique de Jackie O, traduisant ces qualités en une expérience de déballage luxueuse."
                },
                manonGuilbert: {
                    title: "Portfolio Manon Guilbert.",
                    meta: "2025. Identité de Marque, Design UI et Développement Web.",
                    briefingTitle: "BRIEF",
                    briefing: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                    conceptTitle: "CONCEPT",
                    concept1: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                    concept2: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo."
                }
            }
        }
    };

    let currentLang = DEFAULT_LANG;

    // Get nested property from object using dot notation
    function getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) =>
            current && current[key] !== undefined ? current[key] : null, obj);
    }

    // Apply translations to the page
    function applyTranslations(lang) {
        const t = translations[lang];
        if (!t) return;

        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const value = getNestedValue(t, key);

            if (value !== null) {
                // Check if it contains HTML
                if (value.includes('<')) {
                    element.innerHTML = value;
                } else {
                    element.textContent = value;
                }
            }
        });

        // Update all elements with data-i18n-placeholder attribute
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            const value = getNestedValue(t, key);
            if (value !== null) {
                element.placeholder = value;
            }
        });

        // Update all elements with data-i18n-title attribute (for tooltips)
        document.querySelectorAll('[data-i18n-title]').forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            const value = getNestedValue(t, key);
            if (value !== null) {
                element.title = value;
            }
        });

        // Update data attributes for slideshow items
        document.querySelectorAll('[data-i18n-data-title]').forEach(element => {
            const key = element.getAttribute('data-i18n-data-title');
            const value = getNestedValue(t, key);
            if (value !== null) {
                element.setAttribute('data-title', value);
            }
        });

        document.querySelectorAll('[data-i18n-data-meta]').forEach(element => {
            const key = element.getAttribute('data-i18n-data-meta');
            const value = getNestedValue(t, key);
            if (value !== null) {
                element.setAttribute('data-meta', value);
            }
        });

        // Update HTML lang attribute
        document.documentElement.lang = lang;

        // Update language switcher active state
        document.querySelectorAll('.lang-switch').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
        });
    }

    // Set language and save preference
    function setLanguage(lang) {
        if (!SUPPORTED_LANGS.includes(lang)) {
            console.warn(`Language ${lang} not supported, falling back to ${DEFAULT_LANG}`);
            lang = DEFAULT_LANG;
        }

        currentLang = lang;
        localStorage.setItem(STORAGE_KEY, lang);
        applyTranslations(lang);

        // Dispatch custom event for other scripts to react
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
    }

    // Get current language
    function getLanguage() {
        return currentLang;
    }

    // Initialize i18n
    function init() {
        // Check saved preference
        let savedLang = localStorage.getItem(STORAGE_KEY);

        // If no saved preference, check browser language
        if (!savedLang) {
            const browserLang = navigator.language.split('-')[0];
            savedLang = SUPPORTED_LANGS.includes(browserLang) ? browserLang : DEFAULT_LANG;
        }

        currentLang = savedLang;
        applyTranslations(savedLang);

        // Setup language switcher click handlers
        document.querySelectorAll('.lang-switch').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = btn.getAttribute('data-lang');
                setLanguage(lang);
            });
        });
    }

    // Expose API globally
    window.i18n = {
        init,
        setLanguage,
        getLanguage,
        t: (key) => getNestedValue(translations[currentLang], key)
    };

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

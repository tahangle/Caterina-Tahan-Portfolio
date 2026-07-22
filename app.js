/* ==========================================================================
   Caterina Tahan — v7

   One page, no build step. Navigation runs through the URL hash so every
   screen and project stays linkable:

     #/            home
     #/about       about
     #/projects    gallery
     #/manon       a project, by its key in data.js

   Home and About are ONE view, not two. Home is the giant "tahan" with the
   About text sitting under it, blurred; About unblurs that text, reveals the
   extra sections and lifts the whole block up so the title exits the screen.
   Because it's one persistent view, moving between the two never re-renders
   the DOM — it only flips a class on <body>, and CSS animates the rest.

   Content lives in data.js. This file is state, routing and behaviour.
   ========================================================================== */

(function () {
  'use strict';

  /* ---- constants -------------------------------------------------------- */

  var MOBILE_MAX = 700;      // matches the CSS breakpoint
  var COLS = 3;              // detail grid columns
  var SCROLL_THRESHOLD = 40; // px before we call it "scrolled"
  var FOCUS_RATIO = 0.62;    // plates sharpen as they reach 62% viewport height
  var INDEX_ROW = 18;        // px per index row — 14px text at line-height 1.3
  var WHEEL_SWIPE = 120;     // total horizontal travel (px) to change project
  var WHEEL_GAP = 150;       // ms of quiet that marks the start of a new gesture
  var WHEEL_LOCKOUT = 700;   // ms between wheel-driven project changes

  var TYPE_SPEED = 75;       // ms per character typed
  var ERASE_SPEED = 40;      // ms per character erased
  var ROLE_HOLD = 2000;      // ms a finished role sits before erasing
  var ROLE_GAP = 350;        // ms between erasing one role and typing the next
  var HERO_ERASE = 90;       // ms per letter when "tahan" unwrites itself
  var CLOCK_TICK = 15000;    // ms between Paris clock updates

  // Project change: out, swap, in. The transform has to be dropped once the
  // motion settles — a transformed ancestor makes position:fixed children
  // (the write-up column) resolve against it instead of the viewport.
  var PROJ_OUT = 720;        // ms the outgoing project takes to leave
  var PROJ_PRE = 40;         // ms the incoming project sits pre-positioned
  var PROJ_SETTLE = 1250;    // ms until the transform is removed

  /* ---- state ------------------------------------------------------------ */

  var state = {
    screen: 'home',      // home | about | projects | detail
    detailKey: null,
    lang: 'en',
    hoverCard: null,
    scrolled: false,
    isMobile: window.innerWidth <= MOBILE_MAX,
    menuOpen: false,
    projPhase: null      // null | out | pre | in
  };

  var el = {};           // cached DOM refs
  var mounted = false;   // has a view been rendered yet?
  var lastWheelNav = 0;
  var lastWheelTime = 0;    // when the last wheel event arrived (gesture detection)
  var wheelAccumX = 0;      // horizontal travel built up within the current gesture
  var rafPending = false;
  var projTimers = [];
  var roleTimer = null, roleIndex = 0, roleText = '';
  var heroTimer = null;
  var clockTimer = null;

  /* ---- helpers ---------------------------------------------------------- */

  function $(id) { return document.getElementById(id); }

  function t() { return I18N[state.lang]; }

  function projectByKey(key) {
    for (var i = 0; i < PROJECTS.length; i++) {
      if (PROJECTS[i].key === key) return PROJECTS[i];
    }
    return null;
  }

  function projectIndex(key) {
    for (var i = 0; i < PROJECTS.length; i++) {
      if (PROJECTS[i].key === key) return i;
    }
    return -1;
  }

  function esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function clearTimers(list) {
    for (var i = 0; i < list.length; i++) clearTimeout(list[i]);
    list.length = 0;
  }

  /* ---- routing ---------------------------------------------------------- */

  // '#/about' -> {screen:'about'}, '#/manon' -> {screen:'detail', key:'manon'}
  function parseHash() {
    var raw = (window.location.hash || '').replace(/^#\/?/, '').replace(/\/$/, '');
    if (!raw) return { screen: 'home', key: null };
    if (raw === 'about') return { screen: 'about', key: null };
    if (raw === 'projects') return { screen: 'projects', key: null };
    if (projectByKey(raw)) return { screen: 'detail', key: raw };
    return { screen: 'home', key: null }; // unknown hash falls back home
  }

  function hashFor(screen, key) {
    if (screen === 'detail') return '#/' + key;
    if (screen === 'home') return '#/';
    return '#/' + screen;
  }

  function navigate(screen, key) {
    var next = hashFor(screen, key);
    if (window.location.hash === next) { applyRoute(); return; }
    window.location.hash = next;   // triggers hashchange -> applyRoute
  }

  function isHomeAbout(screen) {
    return screen === 'home' || screen === 'about';
  }

  function applyRoute() {
    var route = parseHash();

    // Switching between two projects sweeps one out and the next in.
    if (route.screen === 'detail' && state.screen === 'detail' &&
        route.key !== state.detailKey) {
      transitionToProject(route.key);
      return;
    }

    // Home <-> About is one view in two states. Never rebuild it: the lift,
    // the unblur and the title's exit are all mid-flight CSS transitions, and
    // re-rendering would restart them from scratch. The mounted check matters
    // on first load, where screen already reads 'home' and nothing is drawn.
    var staying = mounted &&
      isHomeAbout(state.screen) && isHomeAbout(route.screen);

    state.screen = route.screen;
    state.detailKey = route.key;
    state.menuOpen = false;

    if (staying) {
      renderChrome();
      return;
    }

    state.scrolled = false;
    state.hoverCard = null;
    state.projPhase = null;
    clearTimers(projTimers);
    clearTimeout(heroTimer);
    window.scrollTo(0, 0);
    render();
  }

  // Sweep the current project up and out, swap it, then bring the next one up
  // from below.
  function transitionToProject(key) {
    clearTimers(projTimers);
    setPhase('out');

    projTimers.push(setTimeout(function () {
      window.scrollTo(0, 0);
      state.detailKey = key;
      state.scrolled = false;
      state.projPhase = 'pre';
      render();

      projTimers.push(setTimeout(function () { setPhase('in'); }, PROJ_PRE));
      // Drop the transform once it lands, so the fixed write-up column can
      // position against the viewport again.
      projTimers.push(setTimeout(function () { setPhase(null); }, PROJ_SETTLE));
    }, PROJ_OUT));
  }

  function setPhase(phase) {
    state.projPhase = phase;
    var node = el.app.querySelector('.detail');
    if (!node) return;
    node.classList.remove('is-out', 'is-pre', 'is-in', 'is-set');
    // The settled state ('is-set') keeps the project visible but drops the
    // transform, so the fixed write-up column anchors to the viewport again.
    // Clearing every class instead would fall back to .screen's opacity:0 and
    // the whole project would fade to nothing a second after it arrived.
    node.classList.add(phase ? 'is-' + phase : 'is-set');
  }

  /* ---- render: chrome --------------------------------------------------- */

  function renderChrome() {
    var d = t();

    el.tagline.textContent = d.tagline;
    el.copyright.textContent = d.copyright;
    el.rights.textContent = d.rights;

    var navLinks = document.querySelectorAll('[data-nav]');
    for (var i = 0; i < navLinks.length; i++) {
      var which = navLinks[i].getAttribute('data-nav');
      navLinks[i].textContent = which === 'about' ? d.navAbout : d.navProjects;
      navLinks[i].classList.toggle('is-active', state.screen === which);
    }

    var langBtns = el.langToggle.querySelectorAll('button');
    for (var j = 0; j < langBtns.length; j++) {
      langBtns[j].classList.toggle(
        'is-active', langBtns[j].getAttribute('data-lang') === state.lang);
    }

    el.menuBtn.classList.toggle('is-open', state.menuOpen);
    el.menuBtn.setAttribute('aria-expanded', state.menuOpen ? 'true' : 'false');
    el.menuOverlay.classList.toggle('is-open', state.menuOpen);

    el.socialIg.href = CONTACT.instagram;
    el.socialLi.href = CONTACT.linkedin;
    el.socialMail.href = 'mailto:' + CONTACT.email;

    document.body.className = 'screen-' + state.screen +
      (state.menuOpen ? ' menu-open' : '');
  }

  /* ---- render: blurred cover -------------------------------------------- */

  function renderCover() {
    var key = null;

    if (state.screen === 'projects' && !state.isMobile) {
      key = state.hoverCard;            // follows the hovered card
    } else if (state.screen === 'detail') {
      key = state.detailKey;            // the project you're reading
    }

    var proj = key ? projectByKey(key) : null;

    if (!proj) {
      el.coverBg.classList.remove('is-visible');
      return;
    }

    el.coverBg.style.backgroundImage = 'url("' + proj.cover + '")';
    el.coverBg.classList.toggle('is-contain', proj.coverFit === 'contain');
    el.coverBg.classList.toggle('is-detail', state.screen === 'detail');

    // On a project page the cover fades away as you scroll into the images.
    var show = state.screen === 'detail' ? !state.scrolled : true;
    el.coverBg.classList.toggle('is-visible', show);
  }

  /* ---- render: index ---------------------------------------------------- */

  function renderIndex() {
    var onProjects = state.screen === 'projects';
    var onDetail = state.screen === 'detail';
    var visible = (onProjects || onDetail) && !state.isMobile;

    el.indexBox.classList.toggle('is-visible', visible);
    el.indexArrows.classList.toggle('is-visible', onDetail);
    el.detailMeta.classList.toggle('is-visible', onDetail && !state.isMobile);

    if (!visible) return;

    el.indexList.innerHTML = PROJECTS.map(function (p) {
      return '<a class="index-item" href="' + hashFor('detail', p.key) + '" ' +
             'data-key="' + esc(p.key) + '">' + esc(p.idxTitle) + '</a>';
    }).join('');

    var items = el.indexList.querySelectorAll('.index-item');
    for (var i = 0; i < items.length; i++) {
      var key = items[i].getAttribute('data-key');
      var active = onProjects ? state.hoverCard === key : key === state.detailKey;
      var dimmed = onProjects && state.hoverCard && state.hoverCard !== key;
      // Once you scroll into a project, the other names get out of the way.
      var hidden = onDetail && state.scrolled && !active;

      items[i].classList.toggle('is-active', !!active);
      items[i].classList.toggle('is-dimmed', !!dimmed);
      items[i].classList.toggle('is-hidden', !!hidden);

      items[i].onmouseenter = onProjects ? hoverSetter(key) : null;
      items[i].onmouseleave = onProjects ? hoverSetter(null) : null;
    }

    if (onDetail) {
      var proj = projectByKey(state.detailKey);
      var pc = projectIndex(state.detailKey);
      if (proj) {
        el.detailMetaDate.textContent = proj.date;
        el.detailMetaCat.textContent = proj.category;
        // Line the chips up with this project's row in the index.
        el.detailMeta.style.setProperty(
          '--meta-y', (navY() + pc * INDEX_ROW) + 'px');
      }
    }
  }

  function hoverSetter(key) {
    return function () {
      state.hoverCard = key;
      renderCover();
      renderIndex();
    };
  }

  function navY() {
    var v = getComputedStyle(document.documentElement).getPropertyValue('--nav-y');
    return parseInt(v, 10) || 104;
  }

  /* ---- render: screens -------------------------------------------------- */

  function render() {
    renderChrome();

    if (isHomeAbout(state.screen)) el.app.innerHTML = viewHomeAbout();
    else if (state.screen === 'projects') el.app.innerHTML = viewProjects();
    else if (state.screen === 'detail') el.app.innerHTML = viewDetail();

    mounted = true;
    if (state.projPhase) setPhase(state.projPhase);
    bindScreen();
    renderCover();
    renderIndex();
    measureNav();

    // Let the browser paint at opacity 0 before we fade in.
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        var s = el.app.querySelector('.screen');
        if (s) s.classList.add('is-in');
        var stagger = el.app.querySelectorAll('[data-fade]');
        for (var i = 0; i < stagger.length; i++) {
          (function (node, delay) {
            setTimeout(function () { node.classList.add('is-in'); }, delay);
          })(stagger[i], parseInt(stagger[i].getAttribute('data-fade'), 10));
        }
      });
    });

    if (state.screen === 'detail') {
      blurPlates();
      setTimeout(blurPlates, 90);
      setTimeout(blurPlates, 380);
    }
  }

  // Home and About share this markup. Which one you're looking at is decided
  // entirely by the class on <body> — see the .ha rules in styles.css.
  function viewHomeAbout() {
    var d = t();

    var link = function (href, text) {
      return '<a class="ha-link" href="' + esc(href) + '" target="_blank" ' +
             'rel="noopener">' + esc(text) + '</a>';
    };

    var dots = function (level) {
      var out = '';
      for (var i = 0; i < 4; i++) out += i < level ? '●' : '○';
      return '<span class="lang-dots">' + out + '</span>';
    };

    var languages = LANGUAGES.map(function (l) {
      return '<p>' + esc(d[l.key]) + ' ' + dots(l.level) + '</p>';
    }).join('');

    return '' +
      '<section class="screen ha" id="haScreen">' +
        '<div class="ha-lift">' +
          '<h1 class="hero" id="hero">tahan</h1>' +
          '<div class="ha-row">' +

            '<div class="intro-col">' +
              '<p>' + esc(d.introLead) +
                ' <span class="role" id="role"></span></p>' +
              // Blurred on Home; clicking any of them is a way into About.
              '<p class="intro-blur" data-to-about>' + esc(d.introP2) + '</p>' +
              '<p class="intro-blur" data-to-about>' + esc(d.introP3) + '</p>' +
              '<p class="intro-blur" data-to-about>' + esc(d.introP4) + '</p>' +
            '</div>' +

            '<div class="info-col">' +
              '<div class="info-grid">' +
                '<div>' +
                  '<p class="info-head">' + esc(d.servicesTitle) + '</p>' +
                  '<p>' + esc(d.svcWebDev) + '</p>' +
                  '<p>' + esc(d.svcWebDesign) + '</p>' +
                  '<p>' + esc(d.svcUiux) + '</p>' +
                  '<p>' + esc(d.svcBrand) + '</p>' +
                  '<p>' + esc(d.svcEditorial) + '</p>' +
                '</div>' +
                '<div>' +
                  '<p class="info-head">' + esc(d.contactTitle) + '</p>' +
                  '<p><a class="ha-link" href="mailto:' + esc(CONTACT.email) +
                    '">' + esc(CONTACT.email) + '</a></p>' +
                  '<p>' + esc(CONTACT.phone) + '</p>' +
                '</div>' +
              '</div>' +

              // Only present on About; fades in behind the lift.
              '<div class="extras">' +
                '<div class="info-grid">' +
                  '<p>' + esc(d.languagesTitle) + '</p>' +
                  '<div>' + languages + '</div>' +
                '</div>' +
                '<div class="info-grid">' +
                  '<p>' + esc(d.educationTitle) + '</p>' +
                  '<div>' +
                    '<p>' + link(LINKS.rufa, d.edu1a) + '</p>' +
                    '<p>' + link(LINKS.rufa, d.edu1b) + '</p>' +
                    '<p>' + esc(d.edu1c) + '</p>' +
                    '<p class="ha-gap">' + link(LINKS.esad, d.edu2a) + '</p>' +
                    '<p>' + link(LINKS.esad, d.edu2b) + '</p>' +
                    '<p>' + esc(d.edu2c) + '</p>' +
                  '</div>' +
                '</div>' +
                '<div class="info-grid">' +
                  '<p>' + esc(d.experienceTitle) + '</p>' +
                  '<div>' +
                    '<p class="exp-role">' + esc(d.exp1a) +
                      '<a class="chip open-chip" href="mailto:' +
                      esc(CONTACT.email) + '">' + esc(d.openToWork) + '</a></p>' +
                    '<p>' + esc(d.exp1b) + '</p>' +
                    '<p class="ha-gap">' +
                      link(LINKS.vacarme, d.expIntern + ', Studio Vacarme') +
                    '</p>' +
                    '<p>' + esc(d.exp2b) + '</p>' +
                    '<p class="ha-gap">' + esc(d.expIntern) + ', Sim City LTD</p>' +
                    '<p>' + esc(d.exp3b) + '</p>' +
                  '</div>' +
                '</div>' +
              '</div>' +

            '</div>' +
          '</div>' +
        '</div>' +
      '</section>';
  }

  function viewProjects() {
    var cards = PROJECTS.map(function (p) {
      var cover = p.galleryCover || p.cover;
      var gif = p.hoverGif
        ? '<img class="card-gif" src="' + esc(p.hoverGif) + '" alt="" ' +
          'loading="lazy" aria-hidden="true">'
        : '';
      return '' +
        '<a class="card" href="' + hashFor('detail', p.key) + '" ' +
           'data-key="' + esc(p.key) + '">' +
          '<span class="card-media">' +
            '<img class="card-cover" src="' + esc(cover) + '" ' +
              'alt="' + esc(p.idxTitle) + '" loading="lazy">' +
            gif +
          '</span>' +
          '<span class="card-labels">' +
            '<span class="chip">' + esc(p.date) + '</span>' +
            '<span class="chip">' + esc(p.category) + '</span>' +
          '</span>' +
        '</a>';
    }).join('');

    return '' +
      '<section class="screen projects">' +
        '<div class="grid" data-fade="120">' + cards + '</div>' +
      '</section>';
  }

  function viewDetail() {
    var p = projectByKey(state.detailKey);
    if (!p) return '';
    var loc = p[state.lang];
    var pc = projectIndex(p.key) % COLS;

    // Plates take the project's own column. The write-up goes in one of the
    // others; the remaining column is left empty on purpose.
    var rest = [0, 1, 2].filter(function (c) { return c !== pc; });
    var textCol = pc === 2 ? rest[1] : rest[0];

    // One image frame. `ar` (width/height) shapes the plate to the image so it
    // fills instead of letterboxing in the default 0.78 frame.
    function plateFig(s, cls) {
      var ar = s.ar ? ' style="aspect-ratio:' + s.ar + '"' : '';
      // `pad` slides keep the default matte border (for raw screenshots that
      // have no margin baked in, so they don't bleed to the plate edge).
      var pad = s.pad ? ' is-pad' : '';
      return '' +
        '<figure class="' + (cls || 'plate-fig') + '">' +
          '<div class="plate' + pad + '" data-plate' + ar + '>' +
            '<div class="plate-inner" style="background-image:url(\'' +
              esc(s.img) + '\')"></div>' +
          '</div>' +
        '</figure>';
    }

    var para = function (arr) {
      return arr.map(function (x) { return '<p>' + esc(x) + '</p>'; }).join('');
    };

    var head = '' +
      '<div class="detail-head">' +
        '<h1 class="detail-title">' + esc(p.idxTitle) + '</h1>' +
        '<span class="chip">' + esc(p.date) + '</span>' +
        '<span class="chip">' + esc(p.category) + '</span>' +
      '</div>';

    var text = '' +
      '<div class="detail-text">' +
        '<div class="detail-block">' +
          '<h2>' + esc(loc.c1t) + '</h2>' + para(loc.c1) +
        '</div>' +
        '<div class="detail-block">' +
          '<h2>' + esc(loc.c2t) + '</h2>' + para(loc.c2) +
        '</div>' +
      '</div>';

    var arrows = '' +
      '<div class="detail-arrows">' +
        '<a class="chip" href="' + hashFor('detail', siblingKey(-1)) + '" ' +
          'aria-label="Previous project">&larr;</a>' +
        '<a class="chip" href="' + hashFor('detail', siblingKey(1)) + '" ' +
          'aria-label="Next project">&rarr;</a>' +
      '</div>';

    // Plates take the project's own column. The write-up goes in one of the
    // others; the remaining column is left empty on purpose.
    var plates = p.slides.map(function (s) { return plateFig(s); }).join('');

    return '' +
      '<section class="screen detail detail-' + esc(p.key) + '" style="--text-col:' + textCol + '">' +
        // Mobile only. Desktop gets the title from the fixed index and the
        // date/category from the chips pinned to its row, neither of which
        // exists on a phone — so without this you can't tell what you're
        // looking at.
        head + text +
        '<div class="plate-grid">' +
          '<div class="plate-col" style="grid-column:' + (pc + 1) + '">' +
            plates +
          '</div>' +
        '</div>' +
        arrows +
      '</section>';
  }

  function siblingKey(dir) {
    var i = projectIndex(state.detailKey);
    if (i === -1) return PROJECTS[0].key;
    var n = PROJECTS.length;
    return PROJECTS[((i + dir) % n + n) % n].key;
  }

  /* ---- per-screen wiring ------------------------------------------------ */

  function bindScreen() {
    if (isHomeAbout(state.screen)) {
      // The blurred paragraphs are the invitation into About.
      var blurred = el.app.querySelectorAll('[data-to-about]');
      for (var b = 0; b < blurred.length; b++) {
        blurred[b].addEventListener('click', function () {
          if (state.screen === 'home') navigate('about');
        });
      }
      startTyping();
    }

    if (state.screen === 'projects') {
      var cards = el.app.querySelectorAll('.card');
      for (var i = 0; i < cards.length; i++) {
        var key = cards[i].getAttribute('data-key');
        cards[i].addEventListener('mouseenter', hoverSetter(key));
        cards[i].addEventListener('mouseleave', hoverSetter(null));
      }
    }
  }

  /* ---- home: the role typewriter ---------------------------------------- */

  // Types a role, holds it, erases it, moves to the next. Runs for as long as
  // the home/about view is mounted.
  function startTyping() {
    clearTimeout(roleTimer);
    var node = $('role');
    if (!node) return;

    var type = function () {
      var target = ROLES[roleIndex];
      if (roleText.length < target.length) {
        roleText = target.slice(0, roleText.length + 1);
        node.textContent = roleText;
        roleTimer = setTimeout(type, TYPE_SPEED);
      } else {
        roleTimer = setTimeout(erase, ROLE_HOLD);
      }
    };

    var erase = function () {
      if (roleText.length > 0) {
        roleText = roleText.slice(0, -1);
        node.textContent = roleText;
        roleTimer = setTimeout(erase, ERASE_SPEED);
      } else {
        roleIndex = (roleIndex + 1) % ROLES.length;
        roleTimer = setTimeout(type, ROLE_GAP);
      }
    };

    node.textContent = roleText;
    type();
  }

  // Leaving home for the projects gallery unwrites "tahan" letter by letter
  // first, so the title doesn't just vanish under the transition.
  function eraseHeroThen(done) {
    var hero = $('hero');
    if (!hero || state.screen !== 'home') { done(); return; }

    var word = 'tahan';
    var n = word.length;

    var step = function () {
      n--;
      hero.textContent = word.slice(0, n);
      if (n > 0) heroTimer = setTimeout(step, HERO_ERASE);
      else done();
    };

    clearTimeout(heroTimer);
    heroTimer = setTimeout(step, 60);
  }

  /* ---- the Paris clock in the side rail --------------------------------- */

  function startClock() {
    var tick = function () {
      var time;
      try {
        time = new Date().toLocaleTimeString('en-GB', {
          hour: '2-digit', minute: '2-digit', timeZone: RAIL.timezone
        });
      } catch (e) {
        return; // no Intl timezone support: leave the rail slot empty
      }
      el.railTime.textContent = time + RAIL.timeSuffix;
    };
    tick();
    clearInterval(clockTimer);
    clockTimer = setInterval(tick, CLOCK_TICK);
  }

  /* ---- detail: scroll blur ---------------------------------------------- */

  // Plates sit soft and sharpen as they rise to the focus line. This is a
  // scroll-position readout, not a CSS animation — it has to track the
  // scrollbar exactly.
  function blurPlates() {
    var plates = document.querySelectorAll('[data-plate]');
    if (!plates.length) return;

    var h = window.innerHeight;
    var focus = h * FOCUS_RATIO;

    for (var i = 0; i < plates.length; i++) {
      var rect = plates[i].getBoundingClientRect();
      var blur = 0, opacity = 1;

      if (rect.top > focus) {
        var dist = rect.top - focus;
        blur = Math.min(18, dist / 22);
        opacity = Math.max(0.4, 1 - dist / (h * 0.9));
      }

      plates[i].style.filter = 'blur(' + blur.toFixed(2) + 'px)';
      plates[i].style.opacity = opacity;
    }
  }

  function onScroll() {
    var isScrolled = window.scrollY > SCROLL_THRESHOLD;
    if (isScrolled !== state.scrolled) {
      state.scrolled = isScrolled;
      renderCover();
      renderIndex();
    }
    if (!rafPending) {
      rafPending = true;
      requestAnimationFrame(function () {
        rafPending = false;
        blurPlates();
      });
    }
  }

  /* ---- nav measurement --------------------------------------------------- */

  // The index hangs off the real position of the "Projects" link rather than
  // a hard-coded offset, so it stays put if the word changes length (it does:
  // "Projects" / "Projets").
  function measureNav() {
    var link = document.querySelector('.nav [data-nav="projects"]');
    if (!link) return;
    var r = link.getBoundingClientRect();
    if (!r.width) return;
    var root = document.documentElement;
    root.style.setProperty('--nav-x', Math.round(r.left) + 'px');
    root.style.setProperty('--nav-y', Math.round(r.bottom + 16) + 'px');
  }

  /* ---- global listeners -------------------------------------------------- */

  function onWheel(e) {
    // About page: the info column is the only scrollable region, so a wheel
    // over the big intro text (or the empty space) grabs nothing. Forward it
    // to the column so scrolling works anywhere on the page.
    if (state.screen === 'about') {
      var info = el.app.querySelector('.info-col');
      if (info && !info.contains(e.target)) info.scrollTop += e.deltaY;
      return;
    }

    if (state.screen !== 'detail') return;

    var now = Date.now();

    // A pause since the last wheel event marks a fresh gesture — clear any
    // build-up so the momentum tail of a previous scroll can't bleed into it.
    if (now - lastWheelTime > WHEEL_GAP) wheelAccumX = 0;
    lastWheelTime = now;

    // Only accumulate when the motion is *clearly* sideways. The 1.5x margin
    // rejects the incidental deltaX that rides along with a vertical trackpad
    // scroll — that stray horizontal jitter was switching projects at random.
    if (Math.abs(e.deltaX) < Math.abs(e.deltaY) * 1.5) {
      wheelAccumX = 0;   // any vertical intent cancels a half-finished swipe
      return;
    }
    wheelAccumX += e.deltaX;

    // Require a deliberate amount of horizontal travel before committing.
    if (Math.abs(wheelAccumX) < WHEEL_SWIPE) return;
    if (now - lastWheelNav < WHEEL_LOCKOUT) return;

    var dir = wheelAccumX > 0 ? 1 : -1;
    lastWheelNav = now;
    wheelAccumX = 0;
    navigate('detail', siblingKey(dir));
  }

  function onResize() {
    var mobile = window.innerWidth <= MOBILE_MAX;
    if (mobile !== state.isMobile) {
      state.isMobile = mobile;
      render();
    } else {
      measureNav();
      blurPlates();
    }
  }

  /* ---- boot -------------------------------------------------------------- */

  function init() {
    el.app = $('app');
    el.header = $('header');
    el.tagline = $('tagline');
    el.langToggle = $('langToggle');
    el.menuBtn = $('menuBtn');
    el.menuOverlay = $('menuOverlay');
    el.indexBox = $('indexBox');
    el.indexList = $('indexList');
    el.indexArrows = $('indexArrows');
    el.detailMeta = $('detailMeta');
    el.detailMetaDate = $('detailMetaDate');
    el.detailMetaCat = $('detailMetaCat');
    el.coverBg = $('coverBg');
    el.copyright = $('copyright');
    el.rights = $('rights');
    el.socialIg = $('socialIg');
    el.socialLi = $('socialLi');
    el.socialMail = $('socialMail');
    el.railPlace = $('railPlace');
    el.railCoords = $('railCoords');
    el.railTime = $('railTime');

    el.railPlace.textContent = RAIL.place;
    el.railCoords.textContent = RAIL.coords;
    startClock();

    // Leaving home for the gallery unwrites the title first.
    var projectsLinks = document.querySelectorAll('[data-nav="projects"]');
    for (var p = 0; p < projectsLinks.length; p++) {
      projectsLinks[p].addEventListener('click', function (e) {
        if (state.screen !== 'home') return;   // nothing to unwrite
        e.preventDefault();
        eraseHeroThen(function () { navigate('projects'); });
      });
    }

    // Language toggle.
    el.langToggle.addEventListener('click', function (e) {
      var btn = e.target.closest('button');
      if (!btn) return;
      e.stopPropagation();
      state.lang = btn.getAttribute('data-lang');
      document.documentElement.lang = state.lang;
      render();
    });

    // Mobile menu.
    el.menuBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      state.menuOpen = !state.menuOpen;
      renderChrome();
    });

    // Desktop prev/next under the index.
    $('idxPrev').addEventListener('click', function (e) {
      e.preventDefault();
      navigate('detail', siblingKey(-1));
    });
    $('idxNext').addEventListener('click', function (e) {
      e.preventDefault();
      navigate('detail', siblingKey(1));
    });

    window.addEventListener('hashchange', applyRoute);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('resize', onResize);

    // Fonts land after first paint and change the nav's width.
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(measureNav);
    }

    applyRoute();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

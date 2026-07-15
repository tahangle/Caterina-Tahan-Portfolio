/* ==========================================================================
   Caterina Tahan — v5

   One page, four screens, no build step. Navigation runs through the URL
   hash so every screen and project stays linkable:

     #/            home
     #/about       about
     #/projects    gallery
     #/manon       a project, by its key in data.js

   Content lives in data.js. This file is state, routing and behaviour.
   ========================================================================== */

(function () {
  'use strict';

  /* ---- constants -------------------------------------------------------- */

  var MOBILE_MAX = 700;      // matches the CSS breakpoint
  var COLS = 3;              // detail grid columns
  var TRAIL_THROTTLE = 60;   // ms between trail scraps
  var TRAIL_FADE = 500;      // ms until a scrap starts fading
  var TRAIL_REMOVE = 1500;   // ms until it's gone
  var MOVE_BEFORE_TEXT = 500; // px of movement before the statement can show
  var PAUSE_BEFORE_TEXT = 800; // ms of stillness after that
  var DISSOLVE = 360;        // ms of the project cross-dissolve
  var SCROLL_THRESHOLD = 40; // px before we call it "scrolled"
  var FOCUS_RATIO = 0.62;    // plates sharpen as they reach 62% viewport height
  var INDEX_ROW = 18;        // px per index row — 14px text at line-height 1.3
  var WHEEL_MIN = 28;        // min horizontal delta to count as a swipe
  var WHEEL_LOCKOUT = 700;   // ms between wheel-driven project changes

  /* ---- state ------------------------------------------------------------ */

  var state = {
    screen: 'home',      // home | about | projects | detail
    detailKey: null,
    lang: 'en',
    hoverCard: null,
    scrolled: false,
    isMobile: window.innerWidth <= MOBILE_MAX,
    menuOpen: false
  };

  var el = {};           // cached DOM refs
  var trailTimers = [];  // pending trail timeouts, so we can cancel on exit
  var uid = 0;
  var lastTrailAt = 0;
  var lastX = 0, lastY = 0, moved = 0;
  var pauseTimer = null, statementTimers = [];
  var statementShown = false;
  var dissolveTimer = null;
  var lastWheelNav = 0;
  var rafPending = false;

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

  function applyRoute() {
    var route = parseHash();

    // Switching between two projects cross-dissolves instead of hard-cutting.
    if (route.screen === 'detail' && state.screen === 'detail' &&
        route.key !== state.detailKey) {
      crossDissolveTo(route.key);
      return;
    }

    state.screen = route.screen;
    state.detailKey = route.key;
    state.scrolled = false;
    state.menuOpen = false;
    state.hoverCard = null;

    resetHome();
    clearTimeout(dissolveTimer);
    window.scrollTo(0, 0);
    render();
  }

  function crossDissolveTo(key) {
    var screenEl = el.app.querySelector('.screen');
    if (screenEl) screenEl.classList.remove('is-in');
    clearTimeout(dissolveTimer);
    dissolveTimer = setTimeout(function () {
      state.detailKey = key;
      state.scrolled = false;
      window.scrollTo(0, 0);
      render();
    }, DISSOLVE);
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

    if (state.screen === 'home') el.app.innerHTML = viewHome();
    else if (state.screen === 'about') el.app.innerHTML = viewAbout();
    else if (state.screen === 'projects') el.app.innerHTML = viewProjects();
    else if (state.screen === 'detail') el.app.innerHTML = viewDetail();

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

  function viewHome() {
    return '' +
      '<section class="screen home" id="homeScreen">' +
        '<div class="trail-layer" id="trailLayer"></div>' +
        '<div class="home-prompt" id="homePrompt">' + esc(t().drawPrompt) + '</div>' +
        '<div class="home-center" id="homeCenter"></div>' +
      '</section>';
  }

  function viewAbout() {
    var d = t();
    return '' +
      '<section class="screen about" id="aboutScreen">' +
        '<div class="about-intro" data-fade="80">' +
          '<p>' + esc(d.aboutIntro1) + '</p>' +
          '<p>' + esc(d.aboutIntro2) + '</p>' +
        '</div>' +
        '<div class="about-info" data-fade="260">' +
          '<div>' +
            '<h2>' + esc(d.servicesTitle) + '</h2>' +
            '<ul>' +
              '<li>' + esc(d.svcCreative) + '</li>' +
              '<li>' + esc(d.svcUiux) + '</li>' +
              '<li>' + esc(d.svcBrand) + '</li>' +
              '<li>' + esc(d.svcEditorial) + '</li>' +
            '</ul>' +
          '</div>' +
          '<div>' +
            '<h2>' + esc(d.contactTitle) + '</h2>' +
            '<p><a href="mailto:' + esc(CONTACT.email) + '">' +
              esc(CONTACT.email) + '</a></p>' +
            '<p>' + esc(CONTACT.phone) + '</p>' +
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
            // Mobile only — there's no index on a phone to name the project.
            '<span class="chip card-name">' + esc(p.idxTitle) + '</span>' +
            '<span class="card-meta">' +
              '<span class="chip">' + esc(p.date) + '</span>' +
              '<span class="chip">' + esc(p.category) + '</span>' +
            '</span>' +
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

    var plates = p.slides.map(function (s) {
      return '' +
        '<figure class="plate-fig">' +
          '<div class="plate" data-plate>' +
            '<div class="plate-inner" style="background-image:url(\'' +
              esc(s.img) + '\')"></div>' +
          '</div>' +
        '</figure>';
    }).join('');

    var para = function (arr) {
      return arr.map(function (x) { return '<p>' + esc(x) + '</p>'; }).join('');
    };

    return '' +
      '<section class="screen detail" style="--text-col:' + textCol + '">' +
        // Mobile only. Desktop gets the title from the fixed index and the
        // date/category from the chips pinned to its row, neither of which
        // exists on a phone — so without this you can't tell what you're
        // looking at.
        '<div class="detail-head">' +
          '<h1 class="detail-title">' + esc(p.idxTitle) + '</h1>' +
          '<span class="chip">' + esc(p.date) + '</span>' +
          '<span class="chip">' + esc(p.category) + '</span>' +
        '</div>' +
        '<div class="detail-text">' +
          '<div class="detail-block">' +
            '<h2>' + esc(loc.c1t) + '</h2>' + para(loc.c1) +
          '</div>' +
          '<div class="detail-block">' +
            '<h2>' + esc(loc.c2t) + '</h2>' + para(loc.c2) +
          '</div>' +
        '</div>' +
        '<div class="plate-grid">' +
          '<div class="plate-col" style="grid-column:' + (pc + 1) + '">' +
            plates +
          '</div>' +
        '</div>' +
        '<div class="detail-arrows">' +
          '<a class="chip" href="' + hashFor('detail', siblingKey(-1)) + '" ' +
            'aria-label="Previous project">&larr;</a>' +
          '<a class="chip" href="' + hashFor('detail', siblingKey(1)) + '" ' +
            'aria-label="Next project">&rarr;</a>' +
        '</div>' +
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
    if (state.screen === 'home') {
      var home = $('homeScreen');
      home.addEventListener('mousemove', onHomeMove);
      home.addEventListener('touchmove', onHomeTouch, { passive: true });
      home.addEventListener('touchstart', hidePrompt, { passive: true });
      home.addEventListener('click', function () { navigate('about'); });
    }

    if (state.screen === 'about') {
      // Clicking the page moves on, but not when you're clicking the email.
      $('aboutScreen').addEventListener('click', function (e) {
        if (e.target.closest('a')) return;
        navigate('projects');
      });
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

  /* ---- home: cursor trail ----------------------------------------------- */

  function resetHome() {
    clearTimeout(pauseTimer);
    clearTimers(statementTimers);
    clearTimers(trailTimers);
    moved = 0; lastX = 0; lastY = 0; statementShown = false;
  }

  // Touch users get told to drag, since there's no pointer to discover the
  // trail with. The moment they do, the prompt gets out of the way.
  function hidePrompt() {
    var prompt = $('homePrompt');
    if (prompt) prompt.classList.add('is-out');
  }

  function onHomeTouch(e) {
    hidePrompt();
    var touch = e.touches && e.touches[0];
    if (touch) onHomeMove({ clientX: touch.clientX, clientY: touch.clientY });
  }

  function onHomeMove(e) {
    var layer = $('trailLayer');
    if (!layer) return;

    if (lastX !== 0 || lastY !== 0) {
      var dx = e.clientX - lastX, dy = e.clientY - lastY;
      moved += Math.sqrt(dx * dx + dy * dy);
    }
    lastX = e.clientX; lastY = e.clientY;

    var now = Date.now();
    if (now - lastTrailAt >= TRAIL_THROTTLE) {
      lastTrailAt = now;
      spawnScrap(layer, e.clientX, e.clientY);
    }

    // The statement waits for you to have wandered, then stopped.
    clearTimeout(pauseTimer);
    if (!statementShown && moved >= MOVE_BEFORE_TEXT) {
      pauseTimer = setTimeout(showStatement, PAUSE_BEFORE_TEXT);
    }
  }

  function spawnScrap(layer, x, y) {
    var src = TRAIL_IMAGES[uid % TRAIL_IMAGES.length];
    uid++;

    var node = document.createElement('div');
    node.className = 'trail-img';
    node.style.left = (x - 50) + 'px';
    node.style.top = (y - 50) + 'px';
    node.style.backgroundImage = 'url("' + src + '")';
    layer.appendChild(node);

    trailTimers.push(setTimeout(function () {
      node.classList.add('is-out');
    }, TRAIL_FADE));

    trailTimers.push(setTimeout(function () {
      if (node.parentNode) node.parentNode.removeChild(node);
    }, TRAIL_REMOVE));
  }

  function showStatement() {
    var center = $('homeCenter');
    if (!center) return;
    statementShown = true;

    var d = t();
    center.textContent = d.centerText;      // "Now you know me."
    center.classList.add('is-in');

    statementTimers.push(setTimeout(function () {
      center.classList.remove('is-in');

      statementTimers.push(setTimeout(function () {
        // "Click to know more." — "Click" is its own run in the design.
        center.innerHTML = '<span>' + esc(d.clickWord) + '</span>' +
                           '<span>' + esc(d.clickMore) + '</span>';
        center.classList.add('is-in');
      }, 500));
    }, 2000));
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
    if (state.screen !== 'detail') return;
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    if (Math.abs(e.deltaX) < WHEEL_MIN) return;

    var now = Date.now();
    if (now - lastWheelNav < WHEEL_LOCKOUT) return;
    lastWheelNav = now;

    navigate('detail', siblingKey(e.deltaX > 0 ? 1 : -1));
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

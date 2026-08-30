/* ============================================================
   Shared site chrome — renders the nav + footer into
   <div id="site-nav"></div> and <div id="site-footer"></div>,
   and wires up theme, language, mobile menu, and active-nav.
   Loaded (deferred) by every page. Single source of truth.

   Uses RELATIVE links so it works both when served from a web
   root and when the .html files are opened directly (file://).
   ============================================================ */
(function () {
  'use strict';

  var LINKS = [
    { frag: 'work',           en: 'work',           es: 'trabajo' },
    { frag: 'about',          en: 'about',          es: 'perfil' },
    { frag: 'certifications', en: 'certifications', es: 'certificaciones' },
    { frag: 'experience',     en: 'experience',     es: 'experiencia' },
    { frag: 'education',      en: 'education',       es: 'educación' },
    { frag: 'contact',        en: 'contact',        es: 'contacto' }
  ];

  function label(l) {
    return '<span data-l="en">' + l.en + '</span><span data-l="es">' + l.es + '</span>';
  }

  var SOCIALS = [
    ['https://www.facebook.com/antonioedeltoro',  'Facebook',    'ti-brand-facebook'],
    ['https://github.com/antonioedeltoro',        'GitHub',      'ti-brand-github'],
    ['https://www.instagram.com/antonioedeltoro', 'Instagram',   'ti-brand-instagram'],
    ['https://www.linkedin.com/in/antonioedeltoro/', 'LinkedIn', 'ti-brand-linkedin'],
    ['https://www.threads.net/@antonioedeltoro',  'Threads',     'ti-brand-threads'],
    ['https://www.tiktok.com/@antonioedeltoro',   'TikTok',      'ti-brand-tiktok'],
    ['https://www.twitter.com/antonioedeltoro',   'X / Twitter', 'ti-brand-x'],
    ['https://www.youtube.com/@antonioedeltoro',  'YouTube',     'ti-brand-youtube']
  ].map(function (s) {
    return '<a href="' + s[0] + '" target="_blank" rel="noopener" class="social-icon" aria-label="' + s[1] + '"><i class="ti ' + s[2] + '"></i></a>';
  }).join('');

  // home = '' on the homepage (in-page anchors), 'index.html' elsewhere (jump to homepage section)
  function buildNav(home) {
    var navItems  = LINKS.map(function (l) { return '<li><a href="' + home + '#' + l.frag + '">' + label(l) + '</a></li>'; }).join('');
    var menuItems = LINKS.map(function (l) { return '<a href="' + home + '#' + l.frag + '">' + label(l) + '</a>'; }).join('');
    return (
      '<nav>' +
        '<a href="' + (home || '#') + '" class="nav-logo">Antonio E<span>.</span> del Toro</a>' +
        '<ul class="nav-links">' + navItems + '</ul>' +
        '<div class="nav-right">' +
          '<button class="lang-btn" id="lang-btn" type="button" aria-label="Switch language / Cambiar idioma"><i class="ti ti-language"></i><span id="lang-label">ES</span></button>' +
          '<button class="mode-btn" id="mode-btn" type="button" aria-label="Toggle dark mode"><i class="ti ti-moon"></i></button>' +
          '<button class="hamburger" id="hamburger-btn" type="button" aria-label="Toggle menu"><i class="ti ti-menu-2"></i></button>' +
        '</div>' +
      '</nav>' +
      '<div class="mobile-menu" id="mobile-menu">' + menuItems + '</div>'
    );
  }

  function buildFooter(home) {
    return (
      '<footer class="site-footer">' +
        '<div class="site-footer-inner">' +
          '<span class="footer-copy">' +
            '<span class="footer-dot"></span>' +
            '<span id="yr"></span> · Antonio del Toro · <span data-l="en">Los Angeles, CA</span><span data-l="es">Los Ángeles, CA</span>' +
          '</span>' +
          '<div class="footer-social">' + SOCIALS + '</div>' +
          '<div class="footer-links">' +
            '<a href="https://www.deltoro.codes" target="_blank" rel="noopener">deltoro.codes</a>' +
            '<a href="' + home + '#work">' + label(LINKS[0]) + '</a>' +
            '<a href="' + home + '#about">' + label(LINKS[1]) + '</a>' +
            '<a href="' + home + '#contact">' + label(LINKS[5]) + '</a>' +
            '<a href="terms.html"><span data-l="en">terms</span><span data-l="es">términos</span></a>' +
            '<a href="privacy.html"><span data-l="en">privacy</span><span data-l="es">privacidad</span></a>' +
          '</div>' +
        '</div>' +
      '</footer>'
    );
  }

  function replace(id, html) {
    var el = document.getElementById(id);
    if (el) el.outerHTML = html;
  }

  function init() {
    var root = document.documentElement;
    var onHome = !!document.querySelector('section[id]'); // homepage has in-page sections
    var home = onHome ? '' : 'index.html';

    replace('site-nav', buildNav(home));
    replace('site-footer', buildFooter(home));

    // Footer top-divider only on pages without their own <section> dividers (the legal pages)
    if (!onHome) {
      var footerEl = document.querySelector('.site-footer');
      if (footerEl) footerEl.classList.add('has-top-divider');
    }

    // Dynamic year
    var yr = document.getElementById('yr');
    if (yr) yr.textContent = new Date().getFullYear();

    // ── Theme ──
    var modeBtn = document.getElementById('mode-btn');
    function modeIcon() {
      modeBtn.innerHTML = root.classList.contains('dark') ? '<i class="ti ti-sun"></i>' : '<i class="ti ti-moon"></i>';
    }
    modeIcon();
    modeBtn.addEventListener('click', function () {
      var dark = root.classList.toggle('dark');
      try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch (e) {}
      modeIcon();
    });
    try {
      var mq = window.matchMedia('(prefers-color-scheme: dark)');
      mq.addEventListener('change', function (e) {
        if (!localStorage.getItem('theme')) { root.classList.toggle('dark', e.matches); modeIcon(); }
      });
    } catch (e) {}

    // ── Language ──
    // Nav/footer translate via the .lang-es class + data-l (CSS). Page bodies that use
    // data-es / data-es-ph (the homepage) are swapped here too.
    var i18nEls = document.querySelectorAll('[data-es]');
    var i18nPh  = document.querySelectorAll('[data-es-ph]');
    i18nEls.forEach(function (el) { el.dataset.en = el.innerHTML; });
    i18nPh.forEach(function (el) { el.dataset.enPh = el.placeholder; });

    var langLabel = document.getElementById('lang-label');
    function applyLang(es) {
      root.classList.toggle('lang-es', es);
      root.setAttribute('lang', es ? 'es' : 'en');
      i18nEls.forEach(function (el) { el.innerHTML = es ? el.dataset.es : el.dataset.en; });
      i18nPh.forEach(function (el) { el.placeholder = es ? el.dataset.esPh : el.dataset.enPh; });
      if (langLabel) langLabel.textContent = es ? 'EN' : 'ES';
    }
    applyLang(root.classList.contains('lang-es')); // head script already set the class from saved pref / browser
    document.getElementById('lang-btn').addEventListener('click', function () {
      var es = !root.classList.contains('lang-es');
      try { localStorage.setItem('lang', es ? 'es' : 'en'); } catch (e) {}
      applyLang(es);
    });

    // ── Mobile menu ──
    var hamburger = document.getElementById('hamburger-btn');
    var menu = document.getElementById('mobile-menu');
    function setMenu(open) {
      menu.classList.toggle('open', open);
      hamburger.innerHTML = open ? '<i class="ti ti-x"></i>' : '<i class="ti ti-menu-2"></i>';
    }
    hamburger.addEventListener('click', function () { setMenu(!menu.classList.contains('open')); });
    menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    // Close the open menu when clicking/tapping outside it (nav buttons handle themselves)
    document.addEventListener('click', function (e) {
      if (!menu.classList.contains('open')) return;
      if (menu.contains(e.target) || e.target.closest('nav')) return;
      setMenu(false);
    });

    // ── Active nav (scroll-spy) — only where in-page sections exist (homepage) ──
    if (onHome) {
      var navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');
      var navObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.getAttribute('id');
            navLinks.forEach(function (a) { a.classList.toggle('active', a.hash === '#' + id); });
          }
        });
      }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
      document.querySelectorAll('section[id]').forEach(function (s) { navObserver.observe(s); });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

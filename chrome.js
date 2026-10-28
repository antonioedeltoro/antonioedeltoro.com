/* ============================================================
   Shared site chrome — renders the nav + footer into
   <div id="site-nav"></div> and <div id="site-footer"></div>,
   and wires up theme, language, mobile menu, and active-nav.
   Loaded (deferred) by every page. Single source of truth.

   Builds everything with DOM APIs — no innerHTML/outerHTML — so the
   site can enforce Trusted Types (require-trusted-types-for 'script').

   Uses RELATIVE links so it works both when served from a web
   root and when the .html files are opened directly (file://).
   ============================================================ */
(function () {
  'use strict';

  var LINKS = [
    { frag: 'work',           en: 'work',           es: 'trabajo' },
    { frag: 'security',       en: 'security',       es: 'seguridad' },
    { frag: 'about',          en: 'about',          es: 'perfil' },
    { frag: 'certifications', en: 'certifications', es: 'certificaciones' },
    { frag: 'experience',     en: 'experience',     es: 'experiencia' },
    { frag: 'education',      en: 'education',      es: 'educación' },
    { frag: 'contact',        en: 'contact',        es: 'contacto' }
  ];
  function link(frag) { return LINKS.filter(function (l) { return l.frag === frag; })[0]; }

  var SOCIALS = [
    ['https://www.facebook.com/antonioedeltoro',     'Facebook',    'ti-brand-facebook'],
    ['https://github.com/antonioedeltoro',           'GitHub',      'ti-brand-github'],
    ['https://www.instagram.com/antonioedeltoro',    'Instagram',   'ti-brand-instagram'],
    ['https://www.linkedin.com/in/antonioedeltoro/', 'LinkedIn',    'ti-brand-linkedin'],
    ['https://www.threads.net/@antonioedeltoro',     'Threads',     'ti-brand-threads'],
    ['https://www.tiktok.com/@antonioedeltoro',      'TikTok',      'ti-brand-tiktok'],
    ['https://www.twitch.tv/antonioedeltoro',        'Twitch',      'ti-brand-twitch'],
    ['https://www.twitter.com/antonioedeltoro',      'X / Twitter', 'ti-brand-x'],
    ['https://www.youtube.com/@antonioedeltoro',     'YouTube',     'ti-brand-youtube']
  ];

  // h('a', {href: '#', class: 'x'}, child, 'text', ...) — children may be nodes, strings, or arrays
  function h(tag, attrs) {
    var el = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { el.setAttribute(k, attrs[k]); });
    for (var i = 2; i < arguments.length; i++) append(el, arguments[i]);
    return el;
  }
  function append(el, c) {
    if (c == null) return;
    if (Array.isArray(c)) c.forEach(function (x) { append(el, x); });
    else el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
  }
  function icon(name) { return h('i', { class: 'ti ' + name }); }
  function label(l) { return [h('span', { 'data-l': 'en' }, l.en), h('span', { 'data-l': 'es' }, l.es)]; }
  function newTab(href, attrs) {
    attrs = attrs || {};
    attrs.href = href; attrs.target = '_blank'; attrs.rel = 'noopener';
    return attrs;
  }

  // home = '' on the homepage (in-page anchors), 'index.html' elsewhere (jump to homepage section)
  function buildNav(home) {
    var frag = document.createDocumentFragment();
    frag.appendChild(h('nav', null,
      h('a', { href: home || '#', class: 'nav-logo' }, 'Antonio E', h('span', null, '.'), ' del Toro'),
      h('ul', { class: 'nav-links' }, LINKS.map(function (l) {
        return h('li', null, h('a', { href: home + '#' + l.frag }, label(l)));
      })),
      h('div', { class: 'nav-right' },
        h('button', { class: 'lang-btn', id: 'lang-btn', type: 'button', 'aria-label': 'Switch language / Cambiar idioma' },
          icon('ti-language'), h('span', { id: 'lang-label' }, 'ES')),
        h('button', { class: 'mode-btn', id: 'mode-btn', type: 'button', 'aria-label': 'Toggle dark mode' }, icon('ti-moon')),
        h('button', { class: 'hamburger', id: 'hamburger-btn', type: 'button', 'aria-label': 'Toggle menu' }, icon('ti-menu-2'))
      )
    ));
    frag.appendChild(h('div', { class: 'mobile-menu', id: 'mobile-menu' }, LINKS.map(function (l) {
      return h('a', { href: home + '#' + l.frag }, label(l));
    })));
    return frag;
  }

  function buildFooter(home) {
    return h('footer', { class: 'site-footer' },
      h('div', { class: 'site-footer-inner' },
        h('span', { class: 'footer-copy' },
          h('span', { class: 'footer-dot' }),
          h('span', { id: 'yr' }), ' · Antonio del Toro · ',
          h('span', { 'data-l': 'en' }, 'Los Angeles, CA'), h('span', { 'data-l': 'es' }, 'Los Ángeles, CA')
        ),
        h('div', { class: 'footer-social' }, SOCIALS.map(function (s) {
          return h('a', newTab(s[0], { class: 'social-icon', 'aria-label': s[1] }), icon(s[2]));
        })),
        h('div', { class: 'footer-links' },
          h('a', newTab('https://www.deltoro.codes'), 'deltoro.codes'),
          h('a', { href: home + '#work' }, label(link('work'))),
          h('a', { href: home + '#about' }, label(link('about'))),
          h('a', { href: home + '#contact' }, label(link('contact'))),
          h('a', { href: 'terms.html' }, label({ en: 'terms', es: 'términos' })),
          h('a', { href: 'privacy.html' }, label({ en: 'privacy', es: 'privacidad' }))
        )
      )
    );
  }

  function replace(id, node) {
    var el = document.getElementById(id);
    if (el) el.replaceWith(node);
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
      modeBtn.replaceChildren(icon(root.classList.contains('dark') ? 'ti-sun' : 'ti-moon'));
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
    // All copy ships in both languages as [data-l] pairs; CSS shows the active one
    // via the .lang-es class. Only placeholders (attributes) are swapped here.
    var i18nPh = document.querySelectorAll('[data-es-ph]');
    i18nPh.forEach(function (el) { el.dataset.enPh = el.placeholder; });

    var langLabel = document.getElementById('lang-label');
    function applyLang(es) {
      root.classList.toggle('lang-es', es);
      root.setAttribute('lang', es ? 'es' : 'en');
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
      hamburger.replaceChildren(icon(open ? 'ti-x' : 'ti-menu-2'));
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

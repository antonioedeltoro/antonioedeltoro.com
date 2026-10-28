# Self-hosted fonts

No third-party font or CDN requests — everything is served from this folder via `../fonts.css`.

- **Syne** (400–700), **DM Mono** (300–500): static Latin subsets from Fontsource. SIL OFL 1.1.
- **DM Sans**: variable (weight + optical size) Latin subset from `@fontsource-variable/dm-sans`. SIL OFL 1.1.
- **Tabler Icons 3.46.0** (MIT): `tabler-icons-subset.woff2` contains only the icons the site uses (~3.5 KB vs ~460 KB full).

## Adding a Tabler icon

1. Find its codepoint in `@tabler/icons-webfont/dist/tabler-icons.css` (e.g. `.ti-home:before{content:"\eac1"}`).
2. Add that rule to `fonts.css`.
3. Re-subset with the new codepoint added to the list:

```sh
npm pack @tabler/icons-webfont@3.46.0 && tar xzf tabler-icons-webfont-3.46.0.tgz
pip install fonttools brotli
pyftsubset package/dist/fonts/tabler-icons.ttf \
  --unicodes="U+ea16,U+ea24,U+ec1a,U+ec1c,U+ec20,U+ec8c,U+fb02,U+ec73,U+ed05,U+fc0f,U+ec90,U+ebbe,U+ec42,U+eaf8,U+eb1e,U+eb30,U+eb55" \
  --flavor=woff2 --no-hinting --layout-features='' \
  --output-file=fonts/tabler-icons-subset.woff2
```

Current icons: arrow-down, arrow-up-right, brand-facebook, brand-github, brand-instagram, brand-linkedin, brand-threads, brand-tiktok, brand-twitch, brand-x, brand-youtube, language, menu-2, moon, send, sun, x.

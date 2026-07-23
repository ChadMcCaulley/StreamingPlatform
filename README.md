# Signal

**Cinema, engineered.** A streaming platform UI built as a developer portfolio piece — React, TypeScript, Vite — deployable free on Netlify.

Not a Netflix skin: side-rail shell, bento home, mono metadata, fixed brand mark, dark/light only.

## Demo

```bash
npm install
npm run dev
```

**Login:** `demo@signal.app` / `demo1234`

## Stack

| Layer | Choice |
|--------|--------|
| UI | React + TypeScript + Vite |
| Auth (demo) | Client-side / `localStorage` |
| Deploy | Netlify static + optional Functions |
| Backend | Next (API pass) — deliberately UI-first |

## Features

- **Auth + profiles** — sign in/up, multi-profile picker, per-profile My List
- **Dark / Light** themes only; **brand logo never recolors**
- **App shell** — left rail + top search bar (press `/`)
- **Home bento** — featured tile, up-next, list preview, genre chips
- **Custom video player** — keyboard shortcuts, speed, fullscreen
- Optional Netlify Function: `/api/catalog`

## Brand

- Name: **Signal**
- Mark: lime `#C8F542` plate + dark play glyph (theme-invariant)
- Type: Inter + JetBrains Mono

## Deploy

```bash
npm run build
# publish dist/ — netlify.toml already configured
```

## Project layout

```
src/
  components/   AppShell, SideNav, TopBar, BrandLogo, bento, player…
  pages/        Home, Movies, Series, My List, Search, Watch, Auth, Settings
  context/      Auth, Theme, My List
  data/         Demo catalog
  styles/       Theme tokens
netlify/functions/
```

## License

Demo project — sample media rights belong to their respective owners.

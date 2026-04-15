# md-share

> **v0.1.0** — Static web app

A minimal tool that renders markdown with Mermaid diagram support and lets you share documents as self-contained URLs — no backend, no storage, everything lives in the link.

**Live:** [https://tools.stormlab.app/](https://tools.stormlab.app/)

## Features

- Split view: editor + live preview side by side
- Full markdown rendering with GFM support (tables, task lists, etc.)
- Mermaid diagram rendering
- Syntax highlighting for code blocks
- Share documents as URL — content is compressed and encoded in the hash
- Upload .md files
- Responsive: stacked layout on mobile
- No backend — purely static

## Tech Stack

| Component        | Technology                      |
|------------------|---------------------------------|
| Language         | TypeScript                      |
| UI Framework     | React 19                        |
| Build Tool       | Vite 8                          |
| Markdown         | react-markdown + remark-gfm    |
| Syntax Highlight | rehype-highlight + highlight.js |
| Diagrams         | Mermaid                         |
| URL Encoding     | pako (gzip) + base64url        |
| Styling          | Tailwind CSS 4                  |
| Testing          | Vitest + Playwright             |
| Icons            | Heroicons                       |
| Hosting          | GitHub Pages                    |

## Architecture

See [ADR-001: URL Encoding Strategy](docs/adrs/001-url-encoding-strategy.md).

## Requirements

- Node.js 20+
- npm

## Setup

1. Clone the repository
2. `npm install`
3. `npm run dev`

## Commands

```bash
npm run dev       # Development server
npm run build     # Production build
npm run test      # Unit tests
npm run coverage  # Tests with coverage
npm run typecheck # TypeScript type checking
```

## License

Private use.

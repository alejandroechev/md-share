# ADR-001: URL Encoding Strategy

## Status

Accepted

## Context

md-share needs to encode the entire markdown document in a shareable URL with no backend storage. The URL must be self-contained — anyone with the link can view the document.

## Decision

We use **pako (gzip) compression + base64url encoding** stored in the URL hash fragment (`#`).

### Flow

1. **Encode**: `markdown string` → `pako.deflate()` → `base64url` → `window.location.hash`
2. **Decode**: `hash` → `base64url decode` → `pako.inflate()` → `markdown string`

### Why URL hash?

- The hash fragment (`#...`) is **never sent to the server**, preserving privacy
- No server-side storage needed
- Works with any static hosting (GitHub Pages, CDN, etc.)

### Why compression?

- Raw base64 inflates content by ~33%
- Gzip compression on text typically achieves 60-70% reduction
- Net effect: a 10KB markdown document becomes ~4-5KB in the URL
- Modern browsers support hash fragments well beyond 100KB

### Limits

- Practical limit: ~50KB compressed (after which some URL-sharing tools may truncate)
- The app shows a warning when content exceeds this threshold
- No hard limit enforced — the user decides whether to share

## Consequences

- No backend needed — fully static deployment
- Links are long but functional
- Documents are not discoverable (security through obscurity + hash not sent to server)
- Very large documents (>100KB markdown) may not work in all sharing contexts

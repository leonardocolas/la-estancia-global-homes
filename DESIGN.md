# Design System

This document records the current implementation, not a final brand specification.
The source of truth for styling is `src/styles.css`; inspect it before changing visual
tokens or global styles.

## Verified Current State

- The interface uses Tailwind CSS utilities and CSS custom properties registered in
  the stylesheet's Tailwind theme.
- Display headings use `Urbanist`; body text uses `Epilogue`.
- Colors are expressed in OKLCH and exposed through semantic variables such as
  `--background`, `--foreground`, `--primary`, `--accent`, `--muted`, and `--border`.
- Both `:root` and `.dark` token sets are defined.
- The shared radius is `0.875rem`, with related radius tokens derived from it.
- The existing interface supports Spanish and English through `src/lib/i18n.tsx`.

Treat these as implementation facts, not proof that the visual choices are approved
brand requirements. Preserve existing tokens and conventions unless the user asks for
a visual change.

## Proposals, Not Approved Requirements

- Prefer existing semantic color and radius tokens over one-off values so global
  visual changes remain coherent.
- Keep both supported languages in mind when changing visible copy or layout; allow
  translated text to fit without overlap.
- Before introducing a new font, palette, or global visual direction, ask the user
  whether that brand decision is intended.
# Agent Guidance

These shared instructions apply to GitHub Copilot, OpenCode, Codex, and Claude Code.
Read [Rules.md](Rules.md) before making changes and consult [DESIGN.md](DESIGN.md)
for the verified visual-system snapshot and clearly labeled proposals.

## Verified Project Context

- This is a TypeScript application using React 19, TanStack Start, TanStack Router,
	TanStack Query, Vite, Tailwind CSS 4, and Supabase. Confirm details in
	`package.json` before changing dependencies or architecture.
- Routes are file-based under `src/routes/`. `src/routeTree.gen.ts` is generated;
	do not edit it by hand.
- The current interface has Spanish and English translations in `src/lib/i18n.tsx`.
- `bun.lock` is the repository lockfile. Use Bun for package management and scripts.
- `package.json` currently declares `dev`, `build`, `build:dev`, `preview`, `lint`,
	and `format` scripts. It does not declare a test script.

## Working Practices

- Inspect the relevant implementation and nearby conventions before changing code.
- Keep changes focused on the request. Preserve unrelated work and existing public
	behavior unless the user asks to change it.
- Do not edit generated files by hand. Update their source and use the documented
	generation process when one exists.
- Do not expose secrets or copy values from environment files into documentation,
	source code, logs, or responses.
- Use the existing package scripts for validation. Report exactly which checks ran
	and their outcome; never imply that unrun checks passed.
- Ask before making an ambiguous product, data, security, or architectural decision.

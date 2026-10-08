# AI Collaboration Rules

## Accuracy First

- Do not invent anything. Treat repository contents and explicit user statements as
  evidence; do not fabricate requirements, product behavior, data, schemas, routes,
  APIs, credentials, integrations, or design decisions.
- When a necessary fact is missing or ambiguous, ask the user before deciding.
- Clearly distinguish verified facts from assumptions and proposals. Label proposals
  as proposals, and do not present them as approved requirements.
- Never claim that a command, test, build, or verification was run unless it actually
  was. State when a check is unavailable or has not been run.

## Changes

- Read the relevant files before editing and follow existing project conventions.
- Make the smallest change that satisfies the request. Do not perform unrelated
  cleanup, broad rewrites, or dependency changes without approval.
- Preserve user changes. Never discard or overwrite work outside the requested scope.
- Ask before destructive, data-changing, security-sensitive, or backward-incompatible
  work when the user has not explicitly authorized it.
- Keep documentation consistent with the implementation. If a fact cannot be
  verified, omit it or ask rather than filling the gap with a guess.

## Validation

- Prefer the narrowest relevant check, then run broader checks required by the change.
- Use scripts declared in `package.json`; do not assume an undeclared test command
  or test suite exists.
- Summarize changed areas and validation results concisely when finishing.
---
name: build-check
description: >-
  Verify that all project services build successfully. Check compilation errors,
  type errors, and lint warnings. Adapts to the shell: Azure shells check API/Web
  Docker builds; Netlify shells check function bundling and asset minification.
  Use before running tests, before deployment, after code changes, and on resume.
---

# Build Check

Verify builds succeed before proceeding with tests or deployment.

## Build Commands

### Azure Shells (Express + Next.js)

| Service | Source Build | Docker Build |
|---------|------------|--------------|
| API (TypeScript) | `cd src/api && npm run build` | `docker build -f src/api/Dockerfile .` |
| Web (Next.js) | `cd src/web && npm run build` | `docker build -f src/web/Dockerfile .` |

### Netlify Shells (Functions + Static)

| Service | Build Command |
|---------|--------------|
| Full build | `npm run build` (minify CSS/JS) |
| Functions | `netlify functions:build` (verify all functions bundle) |
| CSS | `npm run minify-css` (if defined) |
| JS | `npm run minify-js` (if defined) |

## Steps

1. **Identify shell type** — Check for `azure.yaml` (Azure) or `netlify.toml` (Netlify)
2. **Identify services** — Azure: Read `azure.yaml` or scan `src/`; Netlify: scan `netlify/functions/` and `public/`
3. **Build each service** — Run the appropriate build command
4. **Capture errors** — Collect compilation errors, type errors, and warnings
5. **Docker / Function build** (if preparing for deployment) — Azure: Docker build; Netlify: function bundling
6. **Report** — Summarize build status per service

## Output Format

```
Service: <name>
Status: PASS | FAIL
Errors: <count>
Warnings: <count>

Details:
- <file>:<line> <error message>
```

## Notes

- Web (Next.js) requires `output: 'standalone'` in `next.config.ts`
- API uses TypeScript with Express

## Mandatory Completion Checklist

The orchestrator MUST verify ALL of the following before marking build-check as complete:

- [ ] Every service (API, Web) has been built — none skipped
- [ ] Each service reports PASS or FAIL with error/warning counts
- [ ] If any service fails to build, the failure details (file, line, message) are included
- [ ] A partial build (one service passes, another not attempted) is reported as "incomplete" — not as PASS

**BLOCKING**: A build-check with any FAIL or incomplete service means the codebase is not ready for testing or deployment. The orchestrator must fix build errors before proceeding.

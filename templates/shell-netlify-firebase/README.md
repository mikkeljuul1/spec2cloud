# spec2cloud — Netlify + Firebase Shell

Shell template for serverless applications using Netlify Functions, Firebase Auth/Firestore, and vanilla JavaScript.

## Stack

| Layer | Technology |
|-------|------------|
| Frontend | Static HTML, vanilla JavaScript (ES2022+), CSS |
| Backend | Netlify serverless functions (Node.js 20+) |
| Authentication | Firebase Authentication |
| Database | Firestore |
| Hosting | Netlify |
| Testing | Vitest (unit), Playwright (e2e), Cucumber (BDD) |

## Project Structure

```
public/              # Static frontend (HTML, CSS, JS)
  css/               # Stylesheets
  js/                # Client-side JavaScript
  img/               # Images
netlify/
  functions/         # Serverless backend functions
tests/               # Unit + BDD tests
  functions/         # Netlify function tests
  features/          # Cucumber step definitions
e2e/                 # Playwright end-to-end tests
specs/               # PRD, FRDs, Gherkin, UI prototypes, contracts
.spec2cloud/         # State + audit log
```

## Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start Netlify dev server (functions + static) |
| `npm test` | Run Vitest unit tests |
| `npm run test:e2e` | Run Playwright e2e tests |
| `npm run test:all` | Run all tests (unit + e2e) |
| `npm run build` | Minify CSS + JS for production |
| `netlify deploy --prod` | Deploy to production |
| `netlify deploy` | Deploy preview |

## Deployment

This shell deploys to Netlify (not Azure). Use `netlify deploy` commands or connect the repo to Netlify for auto-deploy on push to `main`.

### Environment Variables

Set via Netlify dashboard or `netlify env:set`:

```bash
netlify env:set FIREBASE_PROJECT_ID "your-project-id"
netlify env:set FIREBASE_CLIENT_EMAIL "your-sa@project.iam.gserviceaccount.com"
netlify env:set FIREBASE_PRIVATE_KEY "-----BEGIN PRIVATE KEY-----\n..."
```

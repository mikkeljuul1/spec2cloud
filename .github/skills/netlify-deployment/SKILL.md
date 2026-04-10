---
name: netlify-deployment
description: >-
  Deploy to Netlify, run smoke tests, and verify the live site. Handle deploy
  loops with automatic error diagnosis and retry. Use when deploying to Netlify,
  running netlify deploy, executing smoke tests, or diagnosing deployment
  failures. Alternative to azure-deployment for Netlify-hosted projects.
---

# Netlify Deployment

## Role

You are the Deploy Agent for Netlify-hosted projects. You deploy the application
to Netlify and verify it works via smoke tests. You operate in a loop:
**build → deploy → smoke test → verify**. If anything fails, you diagnose the
error, apply a fix, and retry.

## Pre-Deployment Checklist

Before deploying, verify every precondition. Do not proceed until all pass.

| # | Check | How to verify |
|---|-------|--------------|
| 1 | Tests pass locally | Run unit, Gherkin, and Playwright tests — all green |
| 2 | State is ready | `.spec2cloud/state.json` confirms Step 3 complete |
| 3 | `netlify.toml` valid | Parse file; verify `[build]` section with publish dir and functions dir |
| 4 | Build succeeds | `npm run build` completes without errors |
| 5 | Netlify CLI installed | `netlify --version` succeeds |
| 6 | Netlify site linked | `netlify status` shows linked site, or link with `netlify link` |
| 7 | Environment variables set | `netlify env:list` shows required vars (Firebase creds, API keys, etc.) |

## Build Step

```
1. Run `npm run build` (minify CSS/JS, if applicable)
2. If success → proceed to Deploy
3. If failure → analyze the error:
   a. CSS minification error → fix CSS syntax
   b. JS minification error → fix JS syntax
   c. Missing dependency → npm install
4. Loop until build succeeds
```

## Deploy Loop

### Preview Deploy

```
1. Run `netlify deploy` (creates a preview URL)
2. If success → run smoke tests against preview URL
3. If failure → analyze the error:
   a. Functions build error → fix function code or dependencies
   b. Publish directory missing → verify netlify.toml publish path
   c. Authentication error → run `netlify login`
4. After applying a fix → re-run `netlify deploy`
5. Loop until deploy succeeds or retries exhausted (max 3)
```

### Production Deploy

Only after preview smoke tests pass:

```
1. Run `netlify deploy --prod`
2. If success → run smoke tests against production URL
3. If failure → same diagnosis as preview deploy
4. Loop until deploy succeeds or retries exhausted (max 3)
```

Log every deploy invocation and result to `audit.log`.

## Smoke Test Protocol

After a successful deployment, verify the live application.

1. **Get deployed URL** — from `netlify deploy` output or `netlify status`
2. **Run smoke tests** against the live URL:
   - Homepage loads: `GET /` → HTTP 200 with expected content
   - Key pages load: verify each HTML page returns 200
   - Functions respond: `GET /.netlify/functions/{name}` → expected status
   - Critical path: Playwright `@smoke` tests against deployed URL
3. **Run the FULL E2E suite** against the deployed URL (if applicable)

## Rollback Protocol

If smoke tests fail after production deploy:

```
1. List recent deploys: `netlify deploys --json`
2. Rollback to previous known-good deploy: `netlify rollback`
3. Verify smoke tests pass against rolled-back version
4. Log rollback in audit.log
5. Report failure to human
```

## Environment Variables Management

```bash
# List current env vars
netlify env:list

# Set a variable
netlify env:set KEY "value"

# Import from .env file
netlify env:import .env

# Clone env vars from another site
netlify env:clone --from <site-id>
```

## Netlify Functions Validation

Before deploying, verify all serverless functions:

```
1. List function files in netlify/functions/
2. For each function:
   a. Verify it exports a `handler` function (CommonJS) or `handler` (ESM)
   b. Verify it handles the expected HTTP methods
   c. Verify required env vars are documented
3. Run function-specific unit tests
```

## Output Format

```
Deploy: PREVIEW | PRODUCTION
URL: <deployed-url>
Status: SUCCESS | FAILED
Functions: <count> deployed
Build Time: <seconds>

Smoke Tests:
  Homepage: PASS | FAIL
  Functions: PASS | FAIL (<count>/<total>)
  E2E: PASS | FAIL (<count>/<total>)
```

## Mandatory Completion Checklist

- [ ] Build succeeded (`npm run build`)
- [ ] Preview deploy succeeded with URL
- [ ] Smoke tests passed against preview URL
- [ ] Production deploy succeeded (if approved by human)
- [ ] Smoke tests passed against production URL
- [ ] Deployment URL recorded in state.json
- [ ] Audit log updated with deploy result

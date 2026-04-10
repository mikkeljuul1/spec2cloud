---
name: netlify-deploy-diagnostics
description: >-
  Diagnose and resolve Netlify deployment failures by analyzing error output,
  checking function logs, and suggesting fixes. Use when netlify deploy fails,
  functions fail to build, smoke tests fail against live deployment, or any
  deployment error occurs. Alternative to deploy-diagnostics for Netlify projects.
---

# Netlify Deploy Diagnostics

Diagnose and resolve Netlify deployment failures.

## Steps

1. **Parse error output** — Identify the error type from Netlify CLI stdout/stderr
2. **Classify the error** — Match against known patterns (see below)
3. **Check function logs** — Verify function health via `netlify functions:list` and logs
4. **Suggest fix** — Provide specific remediation
5. **Verify fix** — After applying, re-run the failed command

## Known Failure Patterns

| Pattern | Symptom | Fix |
|---------|---------|-----|
| Build failed | `Build script returned non-zero exit code` | Fix build script errors (CSS/JS syntax) |
| Function build error | `Error bundling function` | Fix function code, check dependencies |
| Missing publish dir | `No such file or directory: public` | Verify `netlify.toml` publish path |
| ESM/CJS mismatch | `require is not defined in ES module scope` | Fix module format: use `import`/`export` or set `"type": "module"` |
| Missing dependency | `Cannot find module` | Add dependency to package.json, ensure it's bundled |
| Env var missing | Runtime error due to undefined env var | Set via `netlify env:set` |
| Function timeout | `Task timed out after 10.00 seconds` | Optimize function or increase timeout in netlify.toml |
| Firebase init failure | `Failed to parse service account` | Verify Firebase credentials env vars |
| CORS error | `Access-Control-Allow-Origin` missing | Add CORS headers to function response |

## Diagnostic Commands

```bash
netlify status                              # site link + deploy status
netlify deploys --json                      # recent deploy history
netlify functions:list                      # deployed functions
netlify logs:function <name>                # function-specific logs
netlify env:list                            # environment variables
```

## Function-Specific Diagnostics

```bash
# Test a function locally
netlify functions:invoke <name> --payload '{"key":"value"}'

# Check function bundling
netlify functions:build

# Serve functions locally for debugging
netlify dev
```

## Output Format

```
Error: <classification>
Root Cause: <description>
Fix: <specific action>
Confidence: HIGH | MEDIUM | LOW
```

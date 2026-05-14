# How to release `@yottaltd/openapi-typescript-codegen`

This package publishes to **GitHub Packages** automatically when a new version
lands on `master`. Releases are entirely driven by the `version` field in
`package.json` — bump it, merge it, the workflow does the rest.

## Process

### 1. Decide the version

Follow [semver](https://semver.org):

| Bump  | When                                          | Example         |
| ----- | --------------------------------------------- | --------------- |
| patch | bug fix, no API change                        | `1.2.2 → 1.2.3` |
| minor | new feature, backwards-compatible             | `1.2.3 → 1.3.0` |
| major | breaking change to the generated output / API | `1.3.0 → 2.0.0` |

Reminder: "breaking" includes anything that would make a downstream consumer's
regenerated code stop compiling — renamed templates, changed default flags,
dropped HTTP clients, etc.

### 2. Bump it locally

```sh
npm version <patch|minor|major> --no-git-tag-version
```

This edits `package.json` in place. The `--no-git-tag-version` flag stops npm
from creating a local tag — CI does the tagging for us.

### 3. Open a PR

Include the version bump alongside whatever change you're shipping in this
release. A release PR doesn't have to be version-bump-only; the bump can be
in the same PR as the code changes that justify it.

### 4. Get it reviewed and merged

Normal review process. Tests run on the PR (via the existing CI build job).

### 5. Wait ~2 minutes

Once the PR is merged, the **Publish to GitHub Packages** workflow runs on
master:

1. **Build job** — `npm ci` + `npm test`. Hard gate; nothing else runs if this fails.
2. **Release job** — reads the version from `package.json`, checks whether a
   git tag `v<version>` already exists.
   - **Tag does not exist** (new version): builds via `npm run release`, publishes
     via `npm publish`, creates a `v<version>` tag, and creates a GitHub Release
     with auto-generated release notes from the commits since the previous tag.
   - **Tag already exists** (you forgot to bump): logs a "nothing to do" message
     and exits cleanly. No publish, no overwrite attempt.

### 6. Verify

Three places to look:

- **Actions tab** → most recent workflow run on master is green
- **Releases** (right sidebar of the repo home page) → a new entry appears
- **Packages** (right sidebar) → `@yottaltd/openapi-typescript-codegen` shows
  the new version

## Common mistakes

| Symptom                               | Cause                                      | Fix                                                                                                            |
| ------------------------------------- | ------------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| Workflow ran but nothing published    | Forgot to bump `version`                   | Open a new PR that bumps                                                                                       |
| Workflow ran, logs "already released" | Bumped to a version that already has a tag | Bump higher and re-PR                                                                                          |
| Build job fails                       | Tests failed on the merged commit          | Fix in a follow-up PR. Until then, master sits unpublished — fine, the existing GitHub Packages version stays. |
| `npm publish` returns 403             | Workflow lacks `packages: write` perms     | Should be set in the workflow file; if you've copied it elsewhere, check                                       |
| `npm publish` returns 401             | `NODE_AUTH_TOKEN` not set / wrong          | Workflow uses the auto-provided `secrets.GITHUB_TOKEN` — shouldn't need configuration                          |

## Where the package gets published

GitHub Packages, scoped under the `@yottaltd` organisation. Consumers install
via an `.npmrc` line:

```
@yottaltd:registry=https://npm.pkg.github.com
```

…and then `npm install @yottaltd/openapi-typescript-codegen` from inside any
yotta repo. Public npm registry (`npmjs.com`) is **not** used — this package
isn't on it.

## Manual republish

You **cannot republish over the same version** — GitHub Packages rejects it.
If a release goes out broken, you have two options:

- **Bump and ship a fix.** Usually the right answer. `1.3.0` broken? Ship
  `1.3.1`. Consumers using the broken version notice the breakage and update.
- **Unpublish within 24 hours.** Packages page → version → delete. After 24h
  GitHub Packages refuses to delete (npm policy). Only use this for releases
  that are unambiguously broken.

## Operator's pre-flight checklist

Before opening the bump PR, sanity-check:

- [ ] `npm test` passes locally
- [ ] `npm run lint` passes locally
- [ ] `npm run release` builds without errors (produces `dist/index.js`)
- [ ] You've decided the bump kind (patch / minor / major) and it matches
      what the changes actually are
- [ ] Generated output looks sensible — easiest check is to run the CLI
      against the `temp/` workflow described in repo discussions

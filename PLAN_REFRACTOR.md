## Project refactor & roadmap — Starting point: Scala + Ruby only

Context and intent
- Current repo state: JS/TS and Python runnable scripts have been removed or neutralized. The repository now contains Scala tooling (an `examples` sbt subproject and `CodeExtractor.scala`) and a Ruby `tools/book_builder` skeleton with plugin placeholders. Workflows that previously invoked legacy generators have been gated. The owner intends to continue exclusively with Scala and Ruby.
- Goal: finish the consolidation and deliver a stable, test-covered, documented toolchain where:
  - Scala validates and compiles all examples; tests assert snippets compile and run.
  - Ruby manages content, site/book builds, templating, and optional image generation via an opt-in plugin.

Principles
- Non-destructive: keep an archive branch for historical JS/TS/Python code but treat `main` as the authoritative Scala+Ruby repo.
- Small, testable PRs: each change must have a focused test or smoke validation in CI.
- Opt-in for risky features: anything requiring Node/Python remains opt-in and run only when explicitly enabled via env vars.

High-level deliverables (definition of done)
- A reproducible sbt `examples` subproject that generates sources from `blog/*.md`, compiles them, and runs snippet tests.
- A Ruby gem/CLI (`tools/book_builder`) that supports `new-post`, `build`, `serve`, and plugin hooks for optional features.
- CI pipeline that runs Scala and Ruby tests, lints, and an integration job validating the full extract->compile->build pipeline.
- Documentation: contributor guide, usage docs for CLI, and a short developer onboarding README.

Phased implementation plan (detailed)

Phase A — Verification & stabilization (3–5 days)
- Goal: verify the current Scala and Ruby artifacts work and fix any regressions introduced by the cleanup.
1. Create an `archive/js-ts-py-YYYYMMDD` branch if not already created (safe snapshot). (1 step)
   - Command:
     ```bash
     git checkout -b archive/js-ts-py-$(date +%Y%m%d)
     git push -u origin HEAD
     git checkout main
     ```
2. Run Scala tests locally and on CI:
   - Run: `sbt examples/test` and `sbt examples/compile` to ensure source generation and compile pass.
3. Run Ruby checks locally:
   - Install bundler: `gem install bundler` then `bundle install --gemfile=tools/book_builder/Gemfile`.
   - Run `bundle exec rubocop --format simple` (add .rubocop.yml if missing).
4. Fix immediate issues (syntax, missing deps, minor build script errors) found during verification.

Phase B — Tests, linting, and CI expansion (1 week)
- Goal: add unit and integration tests and make CI run them automatically.
1. Scala: expand `GeneratedSnippetsSpec.scala` with tests for:
   - Multi-file example grouping (metadata `example=` keys).
   - Fence-to-source mapping and line-offset assertions.
   - A failure test that shows a bad snippet produces a useful error.
2. Ruby: add RSpec tests for `tools/book_builder`:
   - Happy-path `new-post` (creates a file with correct front matter).
   - `build` integration smoke test (run book-builder build and confirm `public` or `_site` exists).
3. Add linting actions for both languages:
   - Scala: `scalafmt` + `scalastyle` run in CI. Add `scalafmt.conf` and `scalastyle-config.xml` if missing.
   - Ruby: `rubocop` in CI.
4. CI: update `.github/workflows/ci.yml` with stages:
   - test: runs `sbt examples/test` and `bundle exec rspec`.
   - lint: runs `scalafmt --check` and `rubocop`.
   - integration: run extraction -> compile -> `tools/book_builder/bin/book-builder build` and assert site generated.

Phase C — Repo hygiene & final cleanup (2–3 days)
- Goal: make the tree reflect the Scala+Ruby decision and tidy up tooling artifacts.
1. Agree on hygiene approach (pick one):
   - Keep stubs in `main` (current) and do nothing further.
   - Remove stub files from the listing with `git rm` and commit (non-destructive to history). Recommended for clarity.
   - Purge files from history (destructive) only if urgent (large repo size or secret exposure).
2. If removing from tree: create branch `chore/remove-legacy-sources`, `git rm` the stubbed files, commit with a descriptive message, and open PR for review.
3. Update `README.md` and `CONTRIBUTING.md` to document the new single-language policy and how to opt-in for legacy features.

Phase D — Ray.so / image generation & plugin stabilization (1 week)
- Goal: provide an opt-in Ruby plugin that can generate code images without bringing Node into the default dev path.
1. Implement `tools/book_builder/plugins/ray_so.rb` that:
   - If `ENABLE_RAY_SO==1`, runs a configurable command to produce images.
   - Prefer a native Ruby solution (call `mini_magick` or a light Ruby wrapper around a maintained image service) or wrap `npx carbon-now` as a fallback only when explicitly enabled and the user has Node installed.
2. Add tests for the plugin shim that validate the plugin tries the correct command and exits gracefully when disabled.
3. Document opt-in usage in `tools/book_builder/README.md` and in `PLAN_REFRACTOR.md`.

Phase E — polishing and release (1 week)
- Goal: finalize docs, tag v1.0, and release the toolchain.
1. Finalize contributor docs, add a short onboarding walkthrough (`docs/ONBOARDING.md`) showing local commands for Scala and Ruby.
2. Run a full CI workflow including integration and smoke tests on a release branch.
3. Tag `v1.0` and add release notes summarizing the consolidation.

Engineering details & contracts
- Contract for `CodeExtractor`:
  - Input: markdown files from `blog/` containing fenced ```scala``` blocks, optional fence metadata `example=<id>` and `file=<name>`.
  - Output: generated Scala sources in `code/examples/generated-src` with a `package examples.generated` and an `AllSnippets` entrypoint that runs snippet checks.
  - Error behavior: extraction or compilation errors should fail the build with a clear message showing original markdown source file and approximate line offsets.

- Contract for `tools/book_builder`:
  - Inputs: `blog/` markdown files and `tools/book_builder/templates`.
  - Commands: `new-post <title>`, `build`, `serve`.
  - Plugin hooks: pre/post build and `image-generator` plugin interface guarded by `ENABLE_RAY_SO`.

Edge cases and mitigations
- Snippets that require external dependencies: allow per-snippet metadata for extra sbt dependencies; fail fast with meaningful message and a hint how to opt-in.
- Large repo with many snippets: use incremental generation (only regenerate files when markdown changes) and caching during sbt source generation.
- Contributors on Windows: document Ruby & sbt setup steps; consider Docker for a reproducible contributor image.

Quality gates and minimal verification commands
- Local quick checks:
  - Scala compile + tests:
    ```bash
    sbt examples/compile
    sbt examples/test
    ```
  - Ruby CLI smoke:
    ```bash
    cd tools/book_builder
    gem install bundler
    bundle install --gemfile=Gemfile
    bundle exec book-builder new-post "Test"
    bundle exec book-builder build
    ```

- CI gates (recommended):
  - `sbt examples/test` (fast subset) -> job `scala-tests`
  - `bundle exec rspec` -> job `ruby-tests`
  - `scalafmt --check` + `rubocop` -> job `lint`
  - `integration` job: run generator -> sbt compile -> `bundle exec book-builder build` and assert `public` or `_site` exists.

Roadmap timeline summary (8 weeks but accelerated from current starting point)
- Week 1: Phase A verification + quick fixes.
- Week 2: Phase B tests, linting, CI expansion.
- Week 3: Phase C repo hygiene and docs.
- Week 4: Phase D Ray.so plugin + plugin tests.
- Week 5: Phase E release prep, docs, v1.0 tag.

Deliverables at each milestone
- End of Week 1: all tests pass locally and in CI smoke run; archive branch created; minor fixes merged.
- End of Week 2: test coverage for Scala extractor and Ruby CLI; linting enforced in CI.
- End of Week 3: main branch contains only Scala+Ruby tooling; README & CONTRIBUTING updated.
- End of Week 4: Ray.so plugin implemented as opt-in; documented.
- End of Week 5: tagged v1.0 release and release notes published.

Appendix — commands & PR checklist
- Create PR template with checklist:
  - [ ] Unit tests added/updated
  - [ ] Lint passes locally and in CI
  - [ ] Documentation updated (README/CONTRIBUTING/PLAN_REFRACTOR)
  - [ ] Integration smoke test passes

If you want, I can now:
1. Create the archive branch snapshot (non-destructive).
2. Create a `chore/remove-legacy-sources` branch that `git rm` the stubbed legacy files and push it for a PR.
3. Start implementing Priority A verification steps (run sbt tests & bundler locally in CI) and open PRs for any quick fixes.
## Project refactor & roadmap — Scala + Ruby consolidation

Purpose
- Keep a single, versioned plan for refactoring this repository to use Scala for code & validation and Ruby for content/site tooling. This file contains a critical audit, a phased roadmap, concrete file-level recommendations, verification steps, timeline, risks, and immediate next steps.

Checklist (requirements extracted)
- [x] Detailed plan to achieve main scope (blog → published book)
- [x] Critical review of current implementation
- [x] Full refactor roadmap to simplify stack to Scala + Ruby
- [x] Actionable migration steps, tests/CI strategy, timelines, risks

## Quick critical audit (current problems)
- Mixed toolchain: Node (JS/TS), Python, Scala, unspecified typings — high maintenance cost.
- Overlapping scripts in `tools/` with duplicated responsibilities.
- Weak separation of concerns between content, example extraction/validation, and site generation.
- Likely low test coverage for tooling; changes are risky without CI.
- Content, generated artifacts, and example source are spread across directories without a single source-of-truth.
- Minimal documentation and onboarding instructions.

Goal after refactor
- Single source-of-truth for content and examples.
- Scala for all example compilation/validation and small CLI for extraction.
- Ruby for content management, templating and site/book generation (Jekyll or Middleman).
- Remove or archive Node/Python unless strictly necessary; keep optional plugins in `tools/legacy`.

High-level architecture
- Content: `blog/` or `content/` — markdown with front matter.
- Examples: `code/examples` as an sbt subproject. Canonical example sources live here.
- Scala responsibilities:
  - sbt `examples` project to compile/run snippets and tests.
  - Scala CLI `CodeExtractor` to extract fenced `scala` blocks, assemble example modules, and run compile/tests.
- Ruby responsibilities:
  - `tools/book_builder` gem/CLI (commands: `new-post`, `build`, `serve`).
  - Templating and site/book generation via Jekyll or Middleman.

Phased roadmap (actions + estimated timeline)

Phase 0 — Inventory & CI skeleton (1 week)
- Inventory scripts and responsibilities (one-liner per file).
- Add GitHub Actions CI skeleton: run `sbt test`, `bundle install` and `rubocop`.
- Add `CONTRIBUTING.md`.

Phase 1 — MVP refactor (2–3 weeks)
- Create `code/examples` sbt subproject. Move extracted example sources into canonical locations.
- Implement Scala `CodeExtractor` CLI to parse markdown, extract `scala` fences, write temporary modules, and run compilation/tests.
- Create Ruby gem `tools/book_builder` with `bin/book-builder` (commands: `new-post`, `build`, `serve`).
- Replace `tools/new-post.js`, `tools/extract-code-examples.js`, `tools/build-book.js` with the Ruby CLI + Scala extractor.

Phase 2 — Tests, CI & consolidation (1–2 weeks)
- Add RSpec tests for Ruby CLI and unit tests for Scala extractor logic.
- Expand CI to run Ruby tests and a full integration pipeline (extract → compile → build site).
- Add linting: `scalafmt`, `scalastyle`, and `rubocop`.

Phase 3 — Deprecation & cleanup (1 week) — actualized
- Outcome so far (current repo state):
  - Runnable JS/TS/Python behavior removed from main by replacing source files with non-executable stubs that point to an archive branch. (stubs present in `tools/` and `tools/legacy`)
  - Key legacy scripts that previously executed (e.g., `tools/new-post.js`, `tools/extract-code-examples.js`, `tools/build-book.js`, `tools/ray-so-generator/convert-to-carbon.ts`, `tools/ai-assistant/generate_content.py`) have been neutralized in-place to prevent accidental execution.
  - GitHub Actions that invoked the legacy generators were gated (they now skip generation unless `ENABLE_RAY_SO=1`) and the publish workflow prefers the Ruby `book-builder` when present.
  - Scala extractor (`code/examples/CodeExtractor.scala`), `code/examples` sbt subproject, and a basic Ruby `tools/book_builder` skeleton exist (MVP pieces implemented).
  - Opt-in plugin placeholders for AI assistant and Ray.so exist under `tools/book_builder/plugins`.

- Remaining cleanup choices (pick one):
  - Keep the stubs in `main` (current state) and leave legacy code in git history for recovery — safe and reversible. (recommended)
  - Physically remove the archived source files from the tree (git rm & commit) so they no longer appear in the repository listing. They will still exist in history. (non-destructive)
  - Fully purge files from git history (git-filter-repo / BFG) to reduce repository size — destructive, requires force-push and coordination. (do only if necessary)

Phase 4 — Optional extras & polish (2 weeks)
- Ray.so integration as a Ruby plugin (opt-in): complete the Ruby shim to natively produce images or wrap a minimal Node call under opt-in guard.
- Dockerize the tooling for reproducible builds (optional but useful for CI and contributor onboarding).
- Release automation and changelog generation (tie into CI and the `PLAN_REFRACTOR.md` checkboxes).

Concrete file-level refactor suggestions
- `blog/template-post.md` -> `tools/book_builder/templates/template-post.md` (keep content but standardize front matter).
- `tools/new-post.js` -> `tools/book_builder/bin/new-post` (Ruby + Thor).
- `tools/extract-code-examples.js` -> `code/examples/src/main/scala/CodeExtractor.scala` (Scala CLI).
- `tools/build-book.js` -> `tools/book_builder/bin/build-book`.
- `types/` and `typings/` -> move to `tools/legacy/` or remove if unused.
- Add `Gemfile`, `Rakefile` (optional), and `.rubocop.yml`.
- Extend `build.sbt` with an `examples` subproject.

Minimal developer commands (local)
- Scala examples tests:
```bash
sbt examples/test
```
- Ruby CLI (after `bundle install`):
```bash
bundle exec book-builder new-post "My Post Title"
bundle exec book-builder build
```

Contract (short)
- Inputs: Markdown files in `blog/` with front matter and fenced `scala` code; canonical example sources in `code/`.
- Outputs: Validated Scala examples, static site in `_site/`, book artifacts (HTML/PDF) when requested.
- Error modes: malformed front matter, uncompiled snippets, missing dependencies — these must fail fast with descriptive messages.

Edge cases to handle
- Mixed-language code fences — ignore non-Scala snippets.
- Multi-file examples — support grouping via front matter metadata.
- Snippets requiring extra dependencies — allow per-snippet metadata to add sbt dependencies.
- Large number of snippets — incremental extraction and caching.

Quality gates
- Build: `sbt compile` for examples + `bundle exec jekyll build` for site.
- Lint/typecheck: `scalafmt`/`scalastyle` and `rubocop`.
- Unit tests: ScalaTest/MUnit for Scala; RSpec for Ruby.
- Smoke test: CI job that runs full pipeline on a sample post.

Risks & mitigations
- Rewriting tools may disrupt current workflow — keep `tools/legacy` wrappers and provide compatibility scripts.
- Complex multi-file Scala snippets are hard to infer — implement a small metadata schema (`example-id`, `files`) to group them.
- Team unfamiliar with Ruby — keep Ruby surface area narrow and document commands.

Timeline summary
- Week 1: Inventory + CI skeleton
- Weeks 2–4: MVP refactor (Scala extractor + Ruby CLI)
- Week 5: Tests, CI expansion, linting
- Week 6: Cleanup, docs, release v1.0
- Weeks 7–8 (optional): Docker, ray.so integration, advanced features

Next immediate steps (pick one or more) — actualized and prioritized
The repo is already in a safe, refactored baseline (Scala extractor + Ruby skeleton + gated workflows). The next steps focus on verification, cleanup choices, and CI hardening.

Priority A — verification & CI
1. Run full CI locally or in a PR: `sbt examples/test` and `bundle exec rubocop` / `bundle exec rspec` once tests are added. Fix any failing tests or generator regressions.
2. Add/enable Scala unit tests for `CodeExtractor` edge cases and expand `GeneratedSnippetsSpec.scala` to cover multi-file examples and metadata parsing.
3. Add RSpec for `tools/book_builder` commands (happy path for `new-post` and `build`) and include them in CI.

Priority B — repository hygiene (non-destructive)
4. Create an archive branch snapshot if not already present:

  git checkout -b archive/js-ts-py-$(date +%Y%m%d)
  git push -u origin HEAD

5. Optionally remove the stubbed files from the tree with a single commit (git rm) so the main listing shows only Scala/Ruby tooling. This preserves history.

Priority C — history purge (only if required)
6. If repo size or secrets require complete removal, plan a `git filter-repo` pass and communicate to collaborators; include a rollback plan and exact file list to purge.

Priority D — polish & UX
7. Implement the Ray.so Ruby plugin fully (native Ruby wrapper or an opt-in `npx` fallback), wire it to `tools/book_builder` and document how to opt-in via `ENABLE_RAY_SO`.
8. Improve error mapping from Scala compile errors back to markdown fences (add fence -> source mapping in generated wrappers and surface line offsets in error messages).
9. Prepare release notes and tag a v1.0 once tests and CI pass.

Progress (current)
- Plan and contributing docs: `PLAN_REFRACTOR.md`, `CONTRIBUTING.md` — Done.
- Phase 0: Inventory + CI skeleton — Done (CI skeleton present; key workflows updated).
- Phase 1: Scala extractor and Ruby CLI skeleton — Done (basic implementations present).
- Phase 2: Tests & CI expansion — Partially done (Scala test harness added; Ruby tests pending).
- Phase 3: Deprecation & cleanup — Mostly done via in-place stubbing and gating; final deletion or history purge pending per repo owner decision.

Use this section to mark checkboxes as tasks finish; prefer small, testable PRs for each remaining item.

Notes
- I inferred reasonable defaults where specifics were missing (Jekyll vs Middleman choice, exact sbt layout). We can change tooling choices early in Phase 1 with limited cost.

Contact
- Update this file with task assignments, PR links, and CI statuses as work proceeds.

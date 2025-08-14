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

Phase 3 — Deprecation & cleanup (1 week)
- Move legacy Node/TS/Python files to `tools/legacy` with deprecation notes. (DONE)
- Convert or archive `tools/ai-assistant` as an opt-in Ruby plugin. (ARCHIVED & PLUGIN PLACEHOLDER ADDED)
- Update documentation and publish a v1.0 release of the toolchain.

Phase 4 — Optional extras & polish (2 weeks)
- Ray.so integration as a Ruby plugin (optional).
- Dockerize the tooling for reproducible builds.
- Release automation and changelog generation.

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

Next immediate steps (pick one or more)
1. Create `tools/book_builder` Ruby gem skeleton + `bin/book-builder new-post` implementation.
2. Create `code/examples` sbt subproject + minimal `CodeExtractor.scala` to extract and compile fenced `scala` snippets.
3. Add a GitHub Actions CI workflow that runs `sbt test` and Ruby lint/tests.

Progress
- This plan file was created and added to the repository as a starting checkpoint. Use this file to track progress and mark checkboxes as tasks are completed.

Notes
- I inferred reasonable defaults where specifics were missing (Jekyll vs Middleman choice, exact sbt layout). We can change tooling choices early in Phase 1 with limited cost.

Contact
- Update this file with task assignments, PR links, and CI statuses as work proceeds.

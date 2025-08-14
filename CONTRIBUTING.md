# Contributing

This repository is being refactored to consolidate tooling into Scala (examples & validation) and Ruby (site/book tooling).

Please follow these guidelines when contributing:

- Open issues for bugs and feature requests. Keep titles and descriptions clear.
- Create feature branches named `feat/<short-desc>` or bugfix branches named `fix/<short-desc>`.
- Open PRs against `main` with a description of what changed and why.
- Ensure CI passes before merging. CI currently runs `sbt test` (in `code/`) and Ruby linting when configured.
- Add unit tests for new behavior: Scala examples use ScalaTest or MUnit, Ruby uses RSpec.
- Document any breaking changes in the PR description.

If you're updating tooling, add entries to `PLAN_REFRACTOR.md` showing progress.

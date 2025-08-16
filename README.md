# Scala & ZIO Blog → Book (Scala CLI + Ruby)

This repository is focused on authoring Scala + ZIO content (blog posts and a book) with two first-class toolchains:

- Scala examples and tests driven by Scala CLI (`scala-cli`)
- A small Ruby CLI (Thor) `book-builder` for creating and building posts/site

Legacy JS/TS/Python tooling has been archived; the active stack is Scala + Ruby.

## Quickstart (local)

### Prerequisites

- `scala-cli` (recommended) — used in CI via `VirtusLab/scala-cli-setup`
- Ruby 3.2+, `bundler` — used for `tools/book_builder`

### Setup

Run all Scala tests (root):

```bash
cd code
scala-cli test .
```

Run examples-only tests:

```bash
cd code/examples
scala-cli test .
```

Create a new post using the Ruby book-builder:

```bash
cd tools/book_builder
gem install bundler
bundle install --jobs 4 --retry 3
# make script executable locally if needed
chmod +x bin/book-builder
bundle exec bin/book-builder new-post "My First Scala ZIO Post"
```

Build the static site (Jekyll) with the book-builder:

```bash
cd tools/book_builder
bundle exec bin/book-builder build
```

Run the Ruby unit tests:

```bash
cd tools/book_builder
bundle exec rspec --format documentation
```

## Repository notes

- Project-wide scala-cli directives live at `code/using.sc` (Scala version + ZIO deps).
- Extracted/incomplete snippet sources have been archived under `tools/extracted_archive/` to avoid compiling partial snippets.
- Legacy or neutralized scripts live under `tools/legacy/` (kept for reference only).

## CI notes

- GitHub Actions uses `VirtusLab/scala-cli-setup` + `coursier/cache-action` to run `scala-cli test`.
- The Ruby `book-builder` is exercised in CI; the workflow ensures the `bin/book-builder` script is executable before invocation.

If you want me to:

- Mark `tools/book_builder/bin/book-builder` executable in git (preferred), I can open a PR to set the executable bit; or
- Centralize scala-cli using directives into a single `project.scala` file under `code/`.
# `code/` — Scala CLI quick commands

This folder contains the Scala sources and tests for the project. Use Scala CLI to run and test the code locally (the CI is already configured to use Scala CLI).

Basic commands (run from the repository root):

- Run tests for the `code/` project:

```bash
cd code
scala-cli test .
```

- Run the project (Scala CLI will pick an entrypoint or you can specify a main class):

```bash
cd code
# Run the first discovered `main` or script
scala-cli run .

# Or run a specific main class
scala-cli run --main-class examples.HelloWorld .
```

Troubleshooting
- Ensure `scala-cli` is installed locally. Install from https://scala-cli.virtuslab.org/.
- CI uses `VirtusLab/scala-cli-setup` so `scala-cli` is available in GitHub Actions.
- If dependencies don't resolve, confirm `code/using-scala.cli` exists and declares project-wide `using` directives.

That's it — quick, reproducible commands for local development and CI.

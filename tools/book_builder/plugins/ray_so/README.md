# Ray.so / Carbon integration (opt-in)

This plugin provides an opt-in integration for generating beautiful code images
from Scala code blocks. It's intentionally optional and will only run when
`ENABLE_RAY_SO=1` is set in the environment.

How it works
- If the legacy TypeScript converter exists at `tools/legacy/convert-to-carbon.ts`, the plugin will try to run it via `npx ts-node`.
- Otherwise, it will attempt to call `npx carbon-now` (or other installed CLI) as a fallback.

Enable locally

```bash
export ENABLE_RAY_SO=1
# optionally install dependencies if you will use the legacy generator
# cd tools && npm install

# Run book-builder as normal
cd tools/book_builder
bundle install
bundle exec bin/book-builder build
```

Security

This plugin shells out to external CLIs (Node/npm). Keep API keys and secrets out
of the repo. Use CI secrets for automated runs.

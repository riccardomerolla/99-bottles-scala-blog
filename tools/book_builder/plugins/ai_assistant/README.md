# AI Assistant plugin (opt-in)

This plugin archives the original Python-based AI assistant and exposes it as an
optional plugin for the Ruby `book_builder` tool. It does not run by default; to
enable, set environment variables and follow the steps below.

Enable (local)

```bash
cd tools/book_builder/plugins/ai_assistant
# Install dependencies (if you want to use the original Python script)
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt  # create this file if needed

# Configure your OpenAI key in env
export OPENAI_API_KEY="your-key"
export ENABLE_AI_ASSISTANT=1
```

Usage

The Ruby `book_builder` CLI will look for `ENABLE_AI_ASSISTANT=1` and then call
`tools/ai-assistant/generate_content.py` if present. This keeps AI features
opt-in and explicit.

Security

Never commit API keys or secrets. Use CI secrets and env vars for automation.

# Scala & ZIO Blog-to-Book Automation

A project to create blog posts about Scala and ZIO, with automated tooling to convert them into a published book.

## Features

- Markdown-based content for blog posts and book chapters
- Automated code validation for all examples
- Beautiful code snippets generated with ray.so
- CI/CD pipelines for publishing blog and generating book
- AI-assisted content creation tools

## Getting Started

1. Clone this repository
2. Install dependencies: `npm install`
3. Build tools: `npm run build`
4. Create your first blog post: `npm run new-post "My First Scala ZIO Post"`

## Writing Blog Posts

Blog posts should be created in the `blog/` directory using Markdown. Code examples will automatically be validated and converted to beautiful images.

## Building the Book

When you're ready to compile the book:

```bash
npm run build-book
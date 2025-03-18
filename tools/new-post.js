#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { Command } = require('commander');
const program = new Command();

// Current date in YYYY-MM-DD format
const today = new Date().toISOString().split('T')[0];

// Template for a new blog post
const postTemplate = (title) => `---
title: "${title}"
date: ${today}
tags: ["scala", "zio", "functional-programming"]
excerpt: "A brief description of what this post covers"
cover_image: "/images/default-cover.jpg"
series: "99 Bottles of Scala"
---

# ${title}

Introduction to your article...

## Main Section

Your content here...

\`\`\`scala
// Your Scala code here
import zio._

object Example extends ZIOAppDefault {
  def run = Console.printLine("Hello, ZIO!")
}
\`\`\`

## Conclusion

Summary and next steps...
`;

// Setup CLI arguments
program
  .name('new-post')
  .description('Create a new blog post')
  .argument('<title>', 'title of the blog post')
  .option('-p, --path <path>', 'path to blog directory', 'blog')
  .action((title, options) => {
    // Create filename from title
    const filename = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    // Find next post number
    const blogDir = options.path;
    let nextNum = 1;
    
    try {
      const files = fs.readdirSync(blogDir);
      const postFiles = files.filter(f => f.match(/^\d+-.*\.md$/));
      
      if (postFiles.length > 0) {
        const numbers = postFiles.map(f => parseInt(f.split('-')[0], 10));
        nextNum = Math.max(...numbers) + 1;
      }
    } catch (err) {
      // Directory might not exist
      if (err.code === 'ENOENT') {
        fs.mkdirSync(blogDir, { recursive: true });
        console.log(`Created directory: ${blogDir}`);
      } else {
        console.error(`Error reading directory: ${err.message}`);
        process.exit(1);
      }
    }
    
    // Zero-pad the post number
    const paddedNum = String(nextNum).padStart(2, '0');
    const postPath = path.join(blogDir, `${paddedNum}-${filename}.md`);
    
    // Write the file
    fs.writeFileSync(postPath, postTemplate(title));
    console.log(`Created new blog post: ${postPath}`);
  });

program.parse(process.argv);
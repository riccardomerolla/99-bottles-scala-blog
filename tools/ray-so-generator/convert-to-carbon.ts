/// <reference path="../typings/marked.d.ts" />
import * as marked from 'marked';  // Change import to namespace import
import * as glob from 'glob';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import tmp from 'tmp';
import util from 'util';

// Promisify exec for easier async usage
const execAsync = util.promisify(exec);

interface CodeBlock {
  language: string;
  code: string;
}

// Extract code blocks from markdown
const extractCodeBlocks = (markdown: string): CodeBlock[] => {
  const codeBlocks: CodeBlock[] = [];
  const renderer = new marked.Renderer();
  
  renderer.code = (code, language = '') => {
    codeBlocks.push({ language, code });
    return '';
  };
  
  marked.setOptions({ renderer });  // Use setOptions instead of parse with options
  marked.parse(markdown);
  return codeBlocks;
};

// Generate carbon image using carbon-now-cli
async function generateCarbonImage(code: string, language: string, outputPath: string): Promise<void> {
  console.log(`Generating carbon image for ${language} code to ${outputPath}`);
  
  // Create a temporary file to store the code
  const tempFile = tmp.fileSync({ postfix: `.${language}` });
  
  try {
    // Write code to temp file
    fs.writeFileSync(tempFile.name, code);
    
    // Make sure output directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Use carbon-now-cli to generate image
    // Customize options as needed: -l scale=1 -t vscode etc.
    const carbonCommand = `npx carbon-now ${tempFile.name} --save-to ${outputDir} --save-as ${path.basename(outputPath, '.png')} -t dracula --no-window -l scale=1.0 -l lineNumbers=false`;
    
    await execAsync(carbonCommand);
    console.log(`Generated image: ${outputPath}`);
  } catch (error) {
    console.error(`Error generating carbon image: ${error}`);
  } finally {
    // Clean up temporary file
    tempFile.removeCallback();
  }
}

// Process a single markdown file
async function processMarkdownFile(filePath: string): Promise<void> {
  console.log(`Processing markdown file: ${filePath}`);
  
  try {
    const markdown = fs.readFileSync(filePath, 'utf8');
    const codeBlocks = extractCodeBlocks(markdown);
    
    if (codeBlocks.length === 0) {
      console.log(`No code blocks found in ${filePath}`);
      return;
    }
    
    // Create output directory based on the file name
    const baseName = path.basename(filePath, path.extname(filePath));
    const outputDir = path.join(path.dirname(filePath), 'images', baseName);
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Generate carbon images for each code block
    for (let i = 0; i < codeBlocks.length; i++) {
      const { code, language } = codeBlocks[i];
      
      // Only process Scala code blocks
      if (language.toLowerCase() === 'scala') {
        const outputPath = path.join(outputDir, `code-${i}.png`);
        await generateCarbonImage(code, language, outputPath);
      }
    }
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
  }
}

// Process all markdown files in a directory
async function processMarkdownFiles(directory: string): Promise<void> {
  console.log(`Searching for markdown files in: ${directory}`);
  
  try {
    // Updated glob usage for v10
    const files = await glob.glob(`${directory}/**/*.md`, { absolute: true });
    
    console.log(`Found ${files.length} markdown files`);
    
    for (const file of files) {
      await processMarkdownFile(file);
    }
    
    console.log('Processing complete!');
  } catch (error) {
    console.error('Error processing markdown files:', error);
  }
}

// Command line interface
async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const directories = args.length > 0 ? args : ['./blog', './book/src'];
  
  for (const directory of directories) {
    await processMarkdownFiles(directory);
  }
}

// Run the script
main().catch(console.error);

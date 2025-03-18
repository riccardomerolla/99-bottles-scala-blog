import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { marked } from 'marked';
import glob from 'glob';

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
  
  marked.setOptions({ renderer });
  marked(markdown);
  return codeBlocks;
};

// Generate ray.so image
async function generateRayImage(code: string, language: string, outputPath: string): Promise<void> {
  console.log(`Generating ray.so image for ${language} code to ${outputPath}`);
  
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  await page.goto('https://ray.so/');
  
  // Wait for the editor to load
  await page.waitForSelector('.editor');
  
  // Set code and language
  await page.evaluate((code, language) => {
    // Set code in the editor
    const editorElement = document.querySelector('.monaco-editor textarea');
    if (editorElement) {
      (editorElement as HTMLTextAreaElement).value = code;
      // Trigger input event to update the editor
      const event = new Event('input', { bubbles: true });
      editorElement.dispatchEvent(event);
    }
    
    // Set language if possible
    const languageSelector = document.querySelector('button[aria-label="Language"]');
    if (languageSelector) {
      (languageSelector as HTMLButtonElement).click();
      
      // Find and click the language option
      setTimeout(() => {
        const languageOptions = Array.from(document.querySelectorAll('.language-list button'));
        const option = languageOptions.find(el => 
          el.textContent?.toLowerCase().includes(language.toLowerCase())
        );
        if (option) {
          (option as HTMLButtonElement).click();
        }
      }, 500);
    }
  }, code, language);
  
  // Wait for the changes to apply
  await page.waitForTimeout(1000);
  
  // Make sure output directory exists
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Capture the image
  const elementHandle = await page.$('.editor');
  if (elementHandle) {
    await elementHandle.screenshot({ path: outputPath });
  } else {
    console.error('Could not find editor element to screenshot');
  }
  
  await browser.close();
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
    
    // Generate ray.so images for each code block
    for (let i = 0; i < codeBlocks.length; i++) {
      const { code, language } = codeBlocks[i];
      
      // Only process Scala code blocks
      if (language.toLowerCase() === 'scala') {
        const outputPath = path.join(outputDir, `code-${i}.png`);
        await generateRayImage(code, language, outputPath);
        console.log(`Generated image: ${outputPath}`);
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
    const files = glob.sync(`${directory}/**/*.md`);
    
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
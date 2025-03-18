const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const glob = require('glob');

// Directories to search for markdown files
const DIRS_TO_SEARCH = ['blog', 'book/src'];
// Directory to save extracted code
const OUTPUT_DIR = 'code/src/main/scala/extracted';

// Create output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Extract code blocks from markdown
function extractCodeBlocks(markdown) {
  const codeBlocks = [];
  const renderer = new marked.Renderer();
  
  renderer.code = (code, language) => {
    // Only extract Scala code
    if (language === 'scala') {
      codeBlocks.push({ language, code });
    }
    return '';
  };
  
  marked.setOptions({ renderer });
  marked(markdown);
  return codeBlocks;
}

// Process a markdown file and extract code
function processFile(filePath) {
  console.log(`Processing ${filePath}`);
  const markdown = fs.readFileSync(filePath, 'utf8');
  const codeBlocks = extractCodeBlocks(markdown);
  
  // Generate output filename based on input filename
  const baseName = path.basename(filePath, '.md')
    .replace(/[^a-zA-Z0-9]/g, '_') // Replace non-alphanumeric chars with underscore
    .replace(/_+/g, '_');          // Replace multiple underscores with one
  
  // Write each code block to a separate file
  codeBlocks.forEach((block, index) => {
    if (block.language === 'scala') {
      const outputFile = path.join(OUTPUT_DIR, `${baseName}_${index}.scala`);
      console.log(`Writing ${outputFile}`);
      
      // Try to extract a class or object name from the code
      let className = extractClassName(block.code);
      if (className) {
        // If we found a valid class name, use it in the filename
        const outputFile = path.join(OUTPUT_DIR, `${className}.scala`);
        fs.writeFileSync(outputFile, block.code);
      } else {
        // Otherwise use the generic filename
        fs.writeFileSync(outputFile, block.code);
      }
    }
  });
}

// Extract class or object name from Scala code
function extractClassName(code) {
  // Simple regex to find class, object, or trait definitions
  const match = code.match(/\b(class|object|trait)\s+([a-zA-Z][a-zA-Z0-9_]*)/);
  return match ? match[2] : null;
}

// Find and process all markdown files
function main() {
  console.log('Starting code extraction');
  
  for (const dir of DIRS_TO_SEARCH) {
    if (fs.existsSync(dir)) {
      const files = glob.sync(`${dir}/**/*.md`);
      
      for (const file of files) {
        processFile(file);
      }
    } else {
      console.warn(`Directory not found: ${dir}`);
    }
  }
  
  console.log('Code extraction complete');
}

// Run the script
main();
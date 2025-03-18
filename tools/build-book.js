#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { Command } = require('commander');
const program = new Command();

// Setup CLI arguments
program
  .name('build-book')
  .description('Build the book in various formats')
  .option('-v, --version <version>', 'book version', `${new Date().toISOString().split('T')[0]}-SNAPSHOT`)
  .option('-o, --output <directory>', 'output directory', 'book/generated')
  .option('--pdf', 'generate PDF version', true)
  .option('--epub', 'generate EPUB version', true)
  .option('--html', 'generate HTML version', false)
  .action((options) => {
    console.log(`Building book version ${options.version}...`);
    
    // Ensure output directory exists
    if (!fs.existsSync(options.output)) {
      fs.mkdirSync(options.output, { recursive: true });
      console.log(`Created output directory: ${options.output}`);
    }

    // Create metadata file
    const metadata = {
      title: "Scala and ZIO: Effect-Oriented Programming",
      author: "Riccardo Merolla",
      date: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      version: options.version,
      rights: `Copyright © ${new Date().getFullYear()} Riccardo Merolla`,
      language: "en-US"
    };

    const metadataFile = 'book/src/metadata.yaml';
    let metadataContent = '---\n';
    Object.entries(metadata).forEach(([key, value]) => {
      metadataContent += `${key}: "${value}"\n`;
    });
    metadataContent += '...\n';

    fs.writeFileSync(metadataFile, metadataContent);
    console.log(`Created metadata file: ${metadataFile}`);
    
    // Find all markdown files in src directory
    const srcDir = 'book/src';
    const files = fs.readdirSync(srcDir)
      .filter(file => file.endsWith('.md') && !file.startsWith('metadata'))
      .map(file => path.join(srcDir, file))
      .sort();
      
    console.log(`Found ${files.length} markdown files`);
    
    try {
      // Generate code images if needed
      console.log('Generating code images...');
      try {
        execSync('npm run generate-images -- book/src', { stdio: 'inherit' });
      } catch (error) {
        console.warn('Warning: Could not generate code images:', error.message);
      }

      // Build PDF if requested
      if (options.pdf) {
        const pdfOutput = path.join(options.output, `scala-zio-book-${options.version}.pdf`);
        console.log(`Building PDF: ${pdfOutput}`);
        
        const pdfCmd = [
          'pandoc',
          '--pdf-engine=xelatex',
          '--toc',
          '-V', 'documentclass=book',
          '-V', 'geometry=margin=1in',
          '-o', pdfOutput,
          metadataFile,
          ...files
        ].join(' ');
        
        execSync(pdfCmd, { stdio: 'inherit' });
        console.log('PDF generated successfully');
      }
      
      // Build EPUB if requested
      if (options.epub) {
        const epubOutput = path.join(options.output, `scala-zio-book-${options.version}.epub`);
        console.log(`Building EPUB: ${epubOutput}`);
        
        const epubCmd = [
          'pandoc',
          '--toc',
          '-o', epubOutput,
          metadataFile,
          ...files
        ].join(' ');
        
        execSync(epubCmd, { stdio: 'inherit' });
        console.log('EPUB generated successfully');
      }
      
      // Build HTML if requested
      if (options.html) {
        const htmlOutput = path.join(options.output, `scala-zio-book-${options.version}.html`);
        console.log(`Building HTML: ${htmlOutput}`);
        
        const htmlCmd = [
          'pandoc',
          '--toc',
          '--standalone',
          '-o', htmlOutput,
          metadataFile,
          ...files
        ].join(' ');
        
        execSync(htmlCmd, { stdio: 'inherit' });
        console.log('HTML generated successfully');
      }
      
      console.log('Book build completed successfully');
      
    } catch (error) {
      console.error('Error building book:', error.message);
      process.exit(1);
    }
  });

program.parse(process.argv);
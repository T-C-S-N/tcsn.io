#!/usr/bin/env node
import { readdirSync, statSync, readFileSync, writeFileSync, unlinkSync } from 'fs';
import { join, extname, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function convertTsToJs(content) {
  // Remove TypeScript-specific syntax
  return content
    // Remove type annotations from function parameters
    .replace(/(\w+):\s*\w+(\[\])?(\s*[,)])/g, '$1$3')
    // Remove return type annotations
    .replace(/\):\s*\w+(\[\])?\s*\{/g, ') {')
    // Remove interface declarations (simple ones)
    .replace(/interface\s+\w+\s*\{[^}]*\}/g, '')
    // Remove type imports
    .replace(/import\s+type\s+\{[^}]*\}\s+from\s+['"][^'"]*['"];?\s*/g, '')
    // Remove type assertions
    .replace(/as\s+\w+(\[\])?/g, '')
    // Remove generic type parameters
    .replace(/<[^>]*>/g, '')
    // Remove optional property indicators
    .replace(/(\w+)\?:/g, '$1:')
    // Remove type annotations from variable declarations
    .replace(/:\s*\w+(\[\])?\s*=/g, ' =')
    // Clean up extra whitespace
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    .trim();
}

function convertTsFile(filePath) {
  try {
    console.log(`Converting: ${filePath}`);
    
    const content = readFileSync(filePath, 'utf8');
    const jsContent = convertTsToJs(content);
    
    // Create new .js file path
    const jsFilePath = filePath.replace(/\.ts$/, '.js');
    
    // Write the converted content
    writeFileSync(jsFilePath, jsContent, 'utf8');
    
    // Remove the original .ts file
    unlinkSync(filePath);
    
    console.log(`✅ Converted: ${basename(filePath)} -> ${basename(jsFilePath)}`);
    
  } catch (error) {
    console.error(`❌ Error converting ${filePath}:`, error.message);
  }
}

function walkDirectory(dir) {
  const items = readdirSync(dir);
  
  for (const item of items) {
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Skip node_modules and other irrelevant directories
      if (!['node_modules', '.git', '.next', 'dist', 'build'].includes(item)) {
        walkDirectory(fullPath);
      }
    } else if (stat.isFile() && extname(item) === '.ts') {
      convertTsFile(fullPath);
    }
  }
}

console.log('🔄 Converting TypeScript files to JavaScript...\n');

// Start conversion from src directory
const srcDir = join(__dirname, 'src');
walkDirectory(srcDir);

console.log('\n🎉 TypeScript to JavaScript conversion completed!');
console.log('\n📋 Next steps:');
console.log('1. Remove TypeScript dependencies from package.json');
console.log('2. Update any remaining import statements');
console.log('3. Test your application');

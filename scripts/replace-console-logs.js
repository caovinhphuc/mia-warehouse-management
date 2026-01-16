#!/usr/bin/env node
/**
 * Script to replace console.* with logger
 * Usage: node scripts/replace-console-logs.js
 */

const fs = require('fs');
const path = require('path');

// Files to skip (logger implementation, error tracking, etc.)
const SKIP_FILES = [
  'logger.ts',
  'errorTracking.tsx',
  'logger.js',
  'errorTracking.js',
];

// Directories to skip
const SKIP_DIRS = ['node_modules', 'build', '.git', 'backup'];

// Get relative path for import
function getRelativePath(fromFile, toFile) {
  const fromDir = path.dirname(fromFile);
  const toDir = path.dirname(toFile);
  const relative = path.relative(fromDir, toDir);
  const importPath = relative ? `${relative}/logger` : './logger';
  return importPath.startsWith('.') ? importPath : `./${importPath}`;
}

// Check if file should be processed
function shouldProcessFile(filePath) {
  const fileName = path.basename(filePath);
  if (SKIP_FILES.includes(fileName)) return false;
  
  const parts = filePath.split(path.sep);
  if (parts.some(part => SKIP_DIRS.includes(part))) return false;
  
  return /\.(ts|tsx|js|jsx)$/.test(fileName);
}

// Add logger import to file
function addLoggerImport(content, filePath) {
  // Check if logger is already imported
  if (content.includes('import') && /import.*logger/.test(content)) {
    return content;
  }
  
  // Calculate relative path to logger
  const loggerPath = getRelativePath(filePath, 'src/utils/logger.ts');
  
  // Find the last import statement
  const importRegex = /^import\s+.*$/gm;
  const imports = content.match(importRegex) || [];
  
  if (imports.length > 0) {
    // Add after last import
    const lastImport = imports[imports.length - 1];
    const lastImportIndex = content.lastIndexOf(lastImport);
    const insertIndex = lastImportIndex + lastImport.length;
    
    // Check if there's already a logger import nearby
    const nearbyCode = content.substring(Math.max(0, lastImportIndex - 100), insertIndex + 100);
    if (/import.*logger/.test(nearbyCode)) {
      return content;
    }
    
    return (
      content.substring(0, insertIndex) +
      '\nimport logger from "' + loggerPath + '";' +
      content.substring(insertIndex)
    );
  } else {
    // No imports, add at the top
    return 'import logger from "' + loggerPath + '";\n' + content;
  }
}

// Replace console.* with logger.*
function replaceConsoleLogs(content) {
  // Replace console.log with logger.info (general logging)
  content = content.replace(/console\.log\(/g, 'logger.info(');
  
  // Replace console.warn with logger.warn
  content = content.replace(/console\.warn\(/g, 'logger.warn(');
  
  // Replace console.error with logger.error
  content = content.replace(/console\.error\(/g, 'logger.error(');
  
  // Replace console.info with logger.info
  content = content.replace(/console\.info\(/g, 'logger.info(');
  
  // Replace console.debug with logger.debug
  content = content.replace(/console\.debug\(/g, 'logger.debug(');
  
  return content;
}

// Process a single file
function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Check if file has console.*
    if (!/console\.(log|warn|error|info|debug)\(/.test(content)) {
      return { processed: false, reason: 'No console.* found' };
    }
    
    // Add logger import if needed
    content = addLoggerImport(content, filePath);
    
    // Replace console.* with logger.*
    content = replaceConsoleLogs(content);
    
    // Only write if content changed
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      return { processed: true, changes: true };
    }
    
    return { processed: true, changes: false };
  } catch (error) {
    return { processed: false, error: error.message };
  }
}

// Recursively find all files
function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      if (!SKIP_DIRS.includes(file)) {
        findFiles(filePath, fileList);
      }
    } else if (shouldProcessFile(filePath)) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Main execution
function main() {
  const srcDir = path.join(__dirname, '..', 'src');
  
  if (!fs.existsSync(srcDir)) {
    console.error('src directory not found!');
    process.exit(1);
  }
  
  console.log('🔍 Finding files with console.*...');
  const files = findFiles(srcDir);
  console.log(`Found ${files.length} files to process\n`);
  
  const results = {
    processed: 0,
    changed: 0,
    skipped: 0,
    errors: 0,
  };
  
  files.forEach(file => {
    const result = processFile(file);
    if (result.processed) {
      results.processed++;
      if (result.changes) {
        results.changed++;
        console.log(`✅ ${path.relative(srcDir, file)}`);
      }
    } else {
      results.skipped++;
      if (result.error) {
        results.errors++;
        console.error(`❌ ${path.relative(srcDir, file)}: ${result.error}`);
      }
    }
  });
  
  console.log('\n📊 Summary:');
  console.log(`  Processed: ${results.processed}`);
  console.log(`  Changed: ${results.changed}`);
  console.log(`  Skipped: ${results.skipped}`);
  console.log(`  Errors: ${results.errors}`);
}

if (require.main === module) {
  main();
}

module.exports = { processFile, findFiles };


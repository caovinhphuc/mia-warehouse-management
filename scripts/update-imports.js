#!/usr/bin/env node
/**
 * Script to update imports from old paths to new feature-based paths
 * Usage: node scripts/update-imports.js
 */

const fs = require('fs');
const path = require('path');

// Mapping old paths to new paths
const PATH_MAPPINGS = {
  // Features
  '../module/OrderTab': '../features/orders/components/OrderTab',
  '../module/StaffTab': '../features/staff/components/StaffTab',
  '../module/ScheduleTab': '../features/staff/components/ScheduleTab',
  '../module/PerformanceTab': '../features/staff/components/PerformanceTab',
  '../module/HrModule': '../features/staff/components/HrModule',
  '../module/PickingTab': '../features/picking/components/PickingTab',
  '../module/AlertsTab': '../features/alerts/components/AlertsTab',
  '../module/SettingsTab': '../features/settings/components/SettingsTab',
  '../module/OverviewTab': '../features/dashboard/components/OverviewTab',
  '../module/WarehouseDashboard': '../features/dashboard/components/WarehouseDashboard',
  '../module/WarehouseStaffDashboard': '../features/dashboard/components/WarehouseStaffDashboard',
  '../module/HistoryTab': '../module/HistoryTab', // TODO: Move to features/history
  
  // Shared components
  '../components/ui/': '../shared/components/ui/',
  '../components/layout/': '../shared/components/layout/',
  '../components/forms/': '../shared/components/forms/',
  
  // Shared utilities
  '../hooks/': '../shared/hooks/',
  '../context/': '../shared/context/',
  '../services/': '../shared/services/',
  '../utils/': '../shared/utils/',
  '../types/': '../shared/types/',
  '../constants/': '../shared/constants/',
};

// Files to skip
const SKIP_FILES = [
  'logger.ts',
  'errorTracking.tsx',
];

// Directories to skip
const SKIP_DIRS = ['node_modules', 'build', '.git', 'backup', 'shared', 'features'];

function shouldProcessFile(filePath) {
  const fileName = path.basename(filePath);
  if (SKIP_FILES.includes(fileName)) return false;
  
  const parts = filePath.split(path.sep);
  if (parts.some(part => SKIP_DIRS.includes(part))) return false;
  
  return /\.(ts|tsx|js|jsx)$/.test(fileName);
}

function updateImports(content, filePath) {
  let updated = content;
  let changed = false;
  
  // Update each mapping
  for (const [oldPath, newPath] of Object.entries(PATH_MAPPINGS)) {
    // Match both single and double quotes
    const patterns = [
      new RegExp(`from ['"]${oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(['"])`, 'g'),
      new RegExp(`from ['"]${oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/(['"])`, 'g'),
    ];
    
    patterns.forEach(pattern => {
      if (pattern.test(updated)) {
        updated = updated.replace(pattern, (match, quote) => {
          changed = true;
          return `from "${newPath}${quote === '"' ? '' : quote}`;
        });
      }
    });
    
    // Also handle imports without trailing slash
    const exactPattern = new RegExp(`from ['"]${oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`, 'g');
    if (exactPattern.test(updated)) {
      updated = updated.replace(exactPattern, (match) => {
        changed = true;
        const quote = match.includes("'") ? "'" : '"';
        return `from ${quote}${newPath}${quote}`;
      });
    }
  }
  
  return { content: updated, changed };
}

function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const { content: updated, changed } = updateImports(content, filePath);
    
    if (changed) {
      fs.writeFileSync(filePath, updated, 'utf8');
      return { processed: true, changed: true };
    }
    
    return { processed: true, changed: false };
  } catch (error) {
    return { processed: false, error: error.message };
  }
}

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

function main() {
  const srcDir = path.join(__dirname, '..', 'src');
  
  if (!fs.existsSync(srcDir)) {
    console.error('src directory not found!');
    process.exit(1);
  }
  
  console.log('🔍 Finding files with old imports...');
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
      if (result.changed) {
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

module.exports = { processFile, findFiles, updateImports };


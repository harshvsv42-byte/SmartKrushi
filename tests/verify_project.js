/**
 * SmartKrushi Full-Stack Project Verification Suite
 * Tests repository structure, manifests, and integrity.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
console.log('==================================================================');
console.log('         SMARTKRUSHI FULL-STACK VERIFICATION SUITE');
console.log('==================================================================');
console.log(`Verifying project at: ${rootDir}\n`);

let passedChecks = 0;
let failedChecks = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ [PASS] ${message}`);
    passedChecks++;
  } else {
    console.error(`  ❌ [FAIL] ${message}`);
    failedChecks++;
  }
}

// 1. Structure Checks
console.log('[Phase 1] Validating Core Directory Architecture...');
assert(fs.existsSync(path.join(rootDir, 'frontend')), 'frontend/ directory exists');
assert(fs.existsSync(path.join(rootDir, 'backend')), 'backend/ directory exists');
assert(fs.existsSync(path.join(rootDir, 'docs')), 'docs/ directory exists');
assert(fs.existsSync(path.join(rootDir, 'scripts')), 'scripts/ directory exists');
assert(fs.existsSync(path.join(rootDir, 'package.json')), 'Root package.json exists');
assert(fs.existsSync(path.join(rootDir, 'app.json')), 'Root app.json exists');
assert(fs.existsSync(path.join(rootDir, 'eas.json')), 'Root eas.json exists');
assert(fs.existsSync(path.join(rootDir, '.gitignore')), 'Root .gitignore exists');
assert(fs.existsSync(path.join(rootDir, '.env.example')), 'Root .env.example exists');

// 2. Frontend Checks
console.log('\n[Phase 2] Validating Frontend Architecture & Config...');
assert(fs.existsSync(path.join(rootDir, 'frontend', 'requirements.txt')), 'frontend/requirements.txt setup guide exists');
assert(fs.existsSync(path.join(rootDir, 'frontend', 'package.json')), 'frontend/package.json exists');
assert(fs.existsSync(path.join(rootDir, 'frontend', 'app.json')), 'frontend/app.json exists');
assert(fs.existsSync(path.join(rootDir, 'frontend', 'eas.json')), 'frontend/eas.json exists');
assert(fs.existsSync(path.join(rootDir, 'frontend', 'src', 'app')), 'frontend/src/app (Expo Router) exists');
assert(fs.existsSync(path.join(rootDir, 'frontend', 'src', 'lib', 'api.js')), 'frontend/src/lib/api.js client exists');
assert(fs.existsSync(path.join(rootDir, 'frontend', 'src', 'services', 'api.js')), 'frontend/src/services/api.js exists');

// 3. Backend Checks
console.log('\n[Phase 3] Validating Backend Architecture & Database...');
assert(fs.existsSync(path.join(rootDir, 'backend', 'manage.py')), 'backend/manage.py exists');
assert(fs.existsSync(path.join(rootDir, 'backend', 'config', 'settings.py')), 'backend/config/settings.py exists');
assert(fs.existsSync(path.join(rootDir, 'backend', 'config', 'urls.py')), 'backend/config/urls.py exists');
assert(fs.existsSync(path.join(rootDir, 'backend', 'db.sqlite3')), 'backend/db.sqlite3 database exists');
assert(fs.existsSync(path.join(rootDir, 'backend', 'requirements.txt')), 'backend/requirements.txt exists');
assert(fs.existsSync(path.join(rootDir, 'backend', 'crops')), 'backend/crops app exists');
assert(fs.existsSync(path.join(rootDir, 'backend', 'weather')), 'backend/weather app exists');
assert(fs.existsSync(path.join(rootDir, 'backend', 'soil')), 'backend/soil app exists');
assert(fs.existsSync(path.join(rootDir, 'backend', 'dashboard')), 'backend/dashboard app exists');

// 4. Scripts Checks
console.log('\n[Phase 4] Validating PowerShell Automation Scripts...');
assert(fs.existsSync(path.join(rootDir, 'scripts', 'setup.ps1')), 'scripts/setup.ps1 exists');
assert(fs.existsSync(path.join(rootDir, 'scripts', 'run-backend.ps1')), 'scripts/run-backend.ps1 exists');
assert(fs.existsSync(path.join(rootDir, 'scripts', 'run-frontend.ps1')), 'scripts/run-frontend.ps1 exists');
assert(fs.existsSync(path.join(rootDir, 'scripts', 'run-all.ps1')), 'scripts/run-all.ps1 exists');
assert(fs.existsSync(path.join(rootDir, 'scripts', 'build-apk.ps1')), 'scripts/build-apk.ps1 exists');

// 5. Database Size Check
const dbPath = path.join(rootDir, 'backend', 'db.sqlite3');
if (fs.existsSync(dbPath)) {
  const stats = fs.statSync(dbPath);
  assert(stats.size > 100000, `Database file has real data (${stats.size} bytes)`);
}

console.log('\n==================================================================');
console.log(`TOTAL CHECKS: ${passedChecks + failedChecks} | PASSED: ${passedChecks} | FAILED: ${failedChecks}`);
console.log('==================================================================');

if (failedChecks === 0) {
  console.log('🎉 ALL PROJECT RESTRUCTURING CHECKS PASSED!\n');
  process.exit(0);
} else {
  console.error(`⚠️ ${failedChecks} CHECKS FAILED!\n`);
  process.exit(1);
}

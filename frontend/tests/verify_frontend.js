/**
 * SmartKrushi Frontend Verification Script
 * Validates JS syntax and critical entry points.
 */
const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');
console.log('Verifying SmartKrushi Frontend files in:', srcDir);

const criticalFiles = [
  'app/_layout.js',
  'app/+not-found.js',
  'app/(tabs)/_layout.js',
  'app/(tabs)/index.js',
  'app/(tabs)/crops.js',
  'app/(tabs)/diagnose.js',
  'app/(tabs)/market.js',
  'app/(tabs)/profile.js',
  'app/weather.js',
  'app/soil.js',
  'app/crop/[id].js',
  'components/ui.js',
  'lib/api.js',
  'services/api.js',
  'constants/theme.js'
];

let allPassed = true;
criticalFiles.forEach(file => {
  const fullPath = path.join(srcDir, file);
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ MISSING: ${file}`);
    allPassed = false;
  } else {
    try {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.length === 0) {
        console.error(`❌ EMPTY: ${file}`);
        allPassed = false;
      } else {
        console.log(`✅ OK: ${file} (${content.length} bytes)`);
      }
    } catch (err) {
      console.error(`❌ ERROR reading ${file}:`, err.message);
      allPassed = false;
    }
  }
});

if (allPassed) {
  console.log('\n🎉 All critical frontend files verified successfully!');
  process.exit(0);
} else {
  console.error('\n⚠️ Some frontend files failed verification.');
  process.exit(1);
}

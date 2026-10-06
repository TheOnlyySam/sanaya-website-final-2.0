// SanRack Designer — make a DEVELOPMENT build that trusts the test public key instead of the production one.
// Usage: node make-dev-build.mjs ../app/sanrack-designer.html test-keys/TEST-public-key.json
//   -> writes ../app/sanrack-designer.DEV.html  (never ship this file)
import fs from 'node:fs'; import path from 'node:path';
import { fileURLToPath } from 'node:url';
const [src, pubFile] = process.argv.slice(2);
if (!src || !pubFile) { console.error('Usage: node make-dev-build.mjs <app.html> <TEST-public-key.json>'); process.exit(1); }
const html = fs.readFileSync(src, 'utf8'); const pub = JSON.parse(fs.readFileSync(pubFile, 'utf8'));
const re = /const LIC_PUB = \{.*?\};\r?\n/s;
if (!re.test(html)) { console.error('LIC_PUB line not found in ' + src); process.exit(1); }
const out = html.replace(re, 'const LIC_PUB = ' + JSON.stringify(pub) + '; // DEV BUILD - test key\n')
  .replace(/<title>([^<]*)<\/title>/, '<title>$1 (DEV BUILD)</title>');
const dest = path.join(path.dirname(src), path.basename(src, '.html') + '.DEV.html');
fs.writeFileSync(dest, out); console.log('Dev build written: ' + dest + ' (kid ' + pub.kid + ')');

// Keep the administrator portal's production identity intact. Its QA copy must
// trust the same TEST key as the development app, never the production key.
const managerSrc = fileURLToPath(new URL('license-manager.html', import.meta.url));
const manager = fs.readFileSync(managerSrc, 'utf8');
const productPattern = /const PRODUCT = \{[^\n]+\};/;
if (!productPattern.test(manager)) throw new Error('License Manager PRODUCT declaration not found');
const managerOut = manager.replace(productPattern, 'const PRODUCT = ' + JSON.stringify({ name: 'SanRack Designer (DEV BUILD)', kid: pub.kid, pub: pub.jwk }) + ';')
  .replace(/<title>([^<]*)<\/title>/, '<title>$1 (DEV BUILD)</title>');
const managerDest = managerSrc.replace(/\.html$/, '.DEV.html');
fs.writeFileSync(managerDest, managerOut);
console.log('Dev License Manager written: ' + managerDest);

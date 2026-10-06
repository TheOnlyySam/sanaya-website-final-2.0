// SanRack Designer — command-line licence issuer (backup to the License Manager portal)
// Usage: node issue-key.mjs --machine SR-XXXX-XXXX-XXXX-XXXX --name "Client Name" [--company "Co"] [--edition Pro] [--type perpetual|annual|subscription|trial|nfr] [--expires YYYY-MM-DD] [--key SanRack-PRIVATE-signing-key.json]
import { webcrypto as wc } from 'node:crypto'; import fs from 'node:fs';
const a = Object.fromEntries(process.argv.slice(2).join(' ').split('--').filter(Boolean).map(x => { const i = x.indexOf(' '); return [x.slice(0, i).trim(), x.slice(i + 1).trim().replace(/^"|"$/g, '')]; }));
if (!a.machine || !a.name) { console.error('Need --machine and --name'); process.exit(1); }
if (!/^SR-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}$/.test(a.machine)) { console.error('Machine ID must look like SR-1A2B-3C4D-5E6F-7A8B'); process.exit(1); }
if ((a.type && a.type !== 'perpetual') || a.expires) { console.error('Only lifetime licenses are supported; omit --expires and use --type perpetual.'); process.exit(1); }
const kf = JSON.parse(fs.readFileSync(a.key || 'SanRack-PRIVATE-signing-key.json', 'utf8'));
const key = await wc.subtle.importKey('jwk', kf.jwk, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign']);
const id = 'SRL-' + new Date().getFullYear() + '-' + Buffer.from(wc.getRandomValues(new Uint8Array(3))).toString('hex').toUpperCase();
const p = { kid: kf.kid, id, n: a.name, c: a.company || '', m: a.machine, e: a.edition || 'Pro', t: 'perpetual', i: new Date().toISOString().slice(0, 10), x: null };
const b = Buffer.from(JSON.stringify(p)).toString('base64url');
const sig = Buffer.from(await wc.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, key, Buffer.from(b))).toString('base64url');
console.log(JSON.stringify(p)); console.log('\nSRD1.' + b + '.' + sig);

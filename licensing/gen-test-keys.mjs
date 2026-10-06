// SanRack Designer — generate a TEST signing key pair for development.
// Never use these keys for real customers. The production private key stays with the product owner.
// Usage: node gen-test-keys.mjs            -> writes test-keys/TEST-private-signing-key.json and test-keys/TEST-public-key.json
import { webcrypto as wc } from 'node:crypto'; import fs from 'node:fs';
const kp = await wc.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign', 'verify']);
const priv = await wc.subtle.exportKey('jwk', kp.privateKey); const pub = await wc.subtle.exportKey('jwk', kp.publicKey);
const kid = 'SRD-TEST-' + Buffer.from(wc.getRandomValues(new Uint8Array(3))).toString('hex').toUpperCase();
fs.mkdirSync('test-keys', { recursive: true });
fs.writeFileSync('test-keys/TEST-private-signing-key.json', JSON.stringify({ kid, alg: 'ES256', product: 'SanRack Designer', note: 'TEST KEY - development only', jwk: priv }, null, 2));
fs.writeFileSync('test-keys/TEST-public-key.json', JSON.stringify({ kid, alg: 'ES256', product: 'SanRack Designer', jwk: { kty: pub.kty, crv: pub.crv, x: pub.x, y: pub.y } }, null, 2));
console.log('Test key pair written to test-keys/ (kid ' + kid + ')');

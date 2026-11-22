// Publish only the production manager and public connection settings.
const fs = require('node:fs');
const path = require('node:path');
process.env.NODE_ENV ||= 'production';
require('react-scripts/config/env');
const target = path.join(__dirname, '../public/apps');
fs.mkdirSync(target, { recursive: true });
const config = {
  url: (process.env.REACT_APP_SUPABASE_URL || '').replace(/\/rest\/v1\/?$/, '').replace(/\/$/, ''),
  anonKey: process.env.REACT_APP_SUPABASE_ANON_KEY || '',
};
const html = fs.readFileSync(path.join(__dirname, '../licensing/license-manager.html'), 'utf8');
const products = [
  { output: 'license-manager.html', key: 'public-key.json', name: 'SanRack Designer', version: '1.6.3', machinePrefix: 'SR', keyPrefix: 'SRD1', legacy: require('../licensing/sanrack-legacy-public-key.json') },
  { output: 'sanpower-license-manager.html', key: 'sanpower-public-key.json', name: 'SAN Power Designer', version: '3.0.3', machinePrefix: 'SP', keyPrefix: 'SPD1', legacy: require('../licensing/sanpower-legacy-public-key.json') },
];
for (const { output, key, ...product } of products) {
  const { kid, jwk } = require(path.join(__dirname, '../licensing', key));
  const productConfig = { ...product, kid, pub: jwk };
  const page = html.replace(/const PRODUCT = .*?;/, () => `const PRODUCT = ${JSON.stringify(productConfig)};`)
    .replace('/* SUPABASE_CONFIG */', () => `const SUPABASE_CONFIG = ${JSON.stringify(config).replace(/</g, '\\u003c')};`);
  fs.writeFileSync(path.join(target, output), product.machinePrefix === 'SP'
    ? page.replace(/SanRack Designer|SanRack/g, 'SAN Power Designer').replaceAll('SR-1A2B', 'SP-1A2B').replaceAll('SR-…', 'SP-…').replaceAll('SRD1.eyJ', 'SPD1.eyJ')
    : page);
}

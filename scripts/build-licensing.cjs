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
fs.writeFileSync(path.join(target, 'license-manager.html'), html.replace('/* SUPABASE_CONFIG */', `const SUPABASE_CONFIG = ${JSON.stringify(config).replace(/</g, '\\u003c')};`));

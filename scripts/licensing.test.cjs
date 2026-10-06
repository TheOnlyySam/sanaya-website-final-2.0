const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { webcrypto } = require('node:crypto');

async function manager(fetch = async () => { throw Error('Network unavailable'); }) {
  const keys = await webcrypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign', 'verify']);
  const pub = await webcrypto.subtle.exportKey('jwk', keys.publicKey);
  let script = fs.readFileSync('licensing/license-manager.html', 'utf8').match(/<script>([\s\S]*?)<\/script>/)[1];
  script = script.replace(/const PRODUCT = .*?;/, `const PRODUCT = ${JSON.stringify({ name: 'Test', kid: 'TEST', pub })};`)
    .replace('/* SUPABASE_CONFIG */', 'const SUPABASE_CONFIG = {url:"https://example.supabase.co",anonKey:"public"};')
    .replace("localStorage.removeItem('srlm.key'); pill(); boot();", '');
  const element = { addEventListener() {}, value: '', dataset: {} };
  const ctx = vm.createContext({ crypto: webcrypto, TextEncoder, TextDecoder, btoa, atob, fetch,
    document: { querySelector: () => element, addEventListener() {} },
    localStorage: { getItem: key => key === 'sanaya_supabase_session' ? JSON.stringify({ access_token: 'test-token', expires_at: Date.now()/1000 + 1000 }) : null, removeItem() {} },
    location: { replace() {} }, setTimeout, clearTimeout,
  });
  vm.runInContext(script + '\nrender = () => {}; toast = () => {};', ctx);
  ctx.privateKey = keys.privateKey;
  vm.runInContext('K.priv = privateKey; S.mode = "db";', ctx);
  return { run: code => vm.runInContext(code, ctx), ctx };
}

test('issued activation keys are permanent, machine-bound and cryptographically valid', async () => {
  const m = await manager();
  const licence = await m.run(`makeLicence({name:'Buyer', machine:'SR-1234-5678-ABCD-EF01', edition:'Pro', type:'annual', expires:'2027-01-01'}, 'Issued')`);
  m.ctx.licence = licence;
  const result = await m.run('verifyKey(licence.key)');
  assert.equal(result.ok, true);
  assert.equal(result.p.t, 'perpetual');
  assert.equal(result.p.x, null);
  assert.equal(result.p.m, 'SR-1234-5678-ABCD-EF01');
  assert.equal(licence.expires, '');
  const parts = licence.key.split('.');
  parts[1] = Buffer.from(JSON.stringify({ ...result.p, m: 'SR-0000-0000-0000-0000' })).toString('base64url');
  m.ctx.tampered = parts.join('.');
  assert.equal((await m.run('verifyKey(tampered)')).ok, false);
});

test('failed Supabase writes never add local records', async () => {
  const m = await manager();
  await assert.rejects(m.run(`save('clients', {name:'Buyer'})`), /Network unavailable/);
  assert.equal(m.run('S.clients.length'), 0);
});

test('a multi-record operation uses one transaction and sends the signed-in token', async () => {
  const calls = [];
  const m = await manager(async (url, options) => {
    calls.push({ url, options });
    return { ok: true, text: async () => url.includes('/rpc/') ? '' : '[]' };
  });
  await m.run(`saveBatch([['clients',{_id:'c',name:'Buyer'}],['licences',{_id:'l',clientId:'c'}]])`);
  const writes = calls.filter(c => c.options.method === 'POST');
  assert.equal(writes.length, 1);
  assert.equal(JSON.parse(writes[0].options.body).records.length, 2);
  assert.equal(writes[0].options.headers.Authorization, 'Bearer test-token');
});

test('successful commits are not reported as failed when the subsequent refresh fails', async () => {
  const m = await manager(async url => {
    if (!url.includes('/rpc/')) throw Error('Disconnected');
    return { ok: true, text: async () => '' };
  });
  await m.run(`save('clients',{_id:'c',name:'Buyer'})`);
  assert.equal(m.run('S.clients[0].name'), 'Buyer');
  assert.equal(m.run('S.mode'), 'error');
  await assert.rejects(m.run(`save('clients',{name:'Another'})`), /Connect to Supabase/);
});

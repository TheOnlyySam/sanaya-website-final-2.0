// Run with PGLITE_MODULE set to an installed @electric-sql/pglite module path.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { PGlite } = require(process.env.PGLITE_MODULE || '@electric-sql/pglite');

test('migration enforces admin access, permanent licenses, atomic saves and conflict detection', async () => {
  const db = new PGlite();
  try {
    await db.exec(`create role anon; create role authenticated;
      create schema auth; create table auth.users(id uuid primary key);
      create function auth.uid() returns uuid language sql as $$select null::uuid$$;
      grant usage on schema auth to authenticated;
      create function public.is_academy_admin() returns boolean language sql as
        $$select coalesce(current_setting('test.admin',true),'false') = 'true'$$;`);
    await db.exec(fs.readFileSync('supabase/migrations/20261006_create_licensing.sql', 'utf8'));
    await db.exec("set role authenticated; set test.admin='true'");
    const save = records => db.query('select save_licensing_records($1::jsonb)', [JSON.stringify(records)]);
    const client = { collection: 'clients', id: 'c', data: {name: 'Buyer'} };
    const licence = { collection: 'licences', id: 'l', data: {clientId:'c', licId:'SRL-TEST', machine:'SR-1234-5678-ABCD-EF01', type:'perpetual', expires:'', status:'active', key:'SRD1.payload.signature'} };
    await save([client, licence]);
    assert.equal((await db.query('select machine_code from licensing_licences')).rows[0].machine_code, licence.data.machine);
    await assert.rejects(save([{collection:'clients',id:'orphan',data:{name:'Rolled back'}}, {...licence,id:'dated',data:{...licence.data,licId:'DATED',expires:'2027-01-01'}}]), /lifetime_only/);
    assert.equal((await db.query("select * from licensing_clients where id='orphan'")).rows.length, 0);
    await assert.rejects(save([{...client,version:'2000-01-01T00:00:00Z'}]), /Record changed/);
    const version = (await db.query("select updated_at::text as version from licensing_clients where id='c'")).rows[0].version;
    await save([{...client, version, data:{name:'Updated'}}]);
    await db.exec("set test.admin='false'");
    assert.equal((await db.query('select * from licensing_clients')).rows.length, 0);
    assert.equal((await db.query('select * from licensing_licences')).rows.length, 0);
    await assert.rejects(save([{...client,id:'unauthorized'}]), /Administrator access required/);
    await db.exec('reset role; set role anon');
    await assert.rejects(db.query('select * from licensing_clients'), /permission denied/);
    await assert.rejects(save([client]), /permission denied/);
  } finally { await db.close(); }
});

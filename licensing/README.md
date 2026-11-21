# SanRack lifetime licensing

The Portal's SanRack Licensing card opens the production manager. `npm run build`
publishes it under `/apps/license-manager.html` with the site's existing public
`REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY` settings.

Apply `supabase/migrations/20261006_create_licensing.sql` in the existing Supabase
project before using the manager. It uses the existing `is_academy_admin()` role
check. Customer and license records, computer codes, activation keys, payment
details, notes, and history are stored in the two RLS-protected licensing tables.
Indexed generated columns make customers and computer codes easy to find in the
Supabase table editor. Customer creation plus issuance, transfers, and backup
imports are transactional. Concurrent edits are rejected rather than overwritten.

Sign in with an existing admin account and load the production private signing
key in Settings. That key is deliberately kept only in memory, never published
or stored in browser storage. The supplied production public key remains unchanged
so the issued keys work with the existing desktop verifier. Test builds and test
private keys are excluded from Git and deployment.

New licenses always use the existing SRD1 signature format with `t: perpetual`
and `x: null`. They never expire. The CLI issuer also rejects expiry dates and
non-perpetual types. Already-issued dated keys cannot be changed retroactively;
issue a new lifetime key for each such customer. JSON backups of permanent
licenses can be imported through Settings after signature verification. To move
records from the previous browser-only manager, export its backup in that original
browser first. No customer records were supplied in the licensing folder.

Revocation and transfers update the administrative record. The existing desktop
activation protocol works offline, so old activation keys cannot be remotely
disabled without changing the desktop application's verification protocol.

Validation: `node --test scripts/licensing.test.cjs` and `npm test -- --watchAll=false --runInBand`.

## SanRack and SanPower portal licensing

Apply `supabase/migrations/20261121_support_sanpower_licensing.sql` to the site's Supabase database before enabling SanPower issuance. It preserves existing records and admin policies and allows SanPower machine IDs and activation codes in the shared licence table. The portal has a separate page for each product and shares customer records between them.

Load the matching private activation key in the selected product's Settings. The portal does not store private keys in Supabase. SanRack issues with SRD-9C8D91BF and can verify earlier SRD-1DDC4CBC keys. SanPower issues with SPD-04FFCB33 and needs its original activation private key. Customers' paid update coverage goes in **Paid updates through**. Use **Issue maintenance renewal** to extend coverage and send the resulting replacement code. The lifetime activation itself has no expiry.

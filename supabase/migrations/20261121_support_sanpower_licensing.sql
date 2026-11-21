begin;

-- Retain existing licence rows, lifetime rules, atomic writes, and admin RLS.
alter table public.licensing_licences
  drop constraint licensing_licences_machine_code_check,
  drop constraint signed_key_required,
  add constraint licensing_product_and_key check (
    (machine_code ~ '^SR(-[0-9A-F]{4}){4}$' and coalesce(data->>'key', '') like 'SRD1.%')
    or
    (machine_code ~ '^SP(-[0-9A-F]{4}){4}$' and coalesce(data->>'key', '') like 'SPD1.%')
  );

commit;

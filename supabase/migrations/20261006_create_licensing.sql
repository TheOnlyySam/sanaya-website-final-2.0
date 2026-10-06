begin;

-- Keep the original record shape (including payments, notes and event history)
-- while exposing indexed customer and machine identifiers in the dashboard.
create table public.licensing_clients (
  id text primary key,
  data jsonb not null check (jsonb_typeof(data) = 'object' and length(data->>'name') > 0),
  name text generated always as (data->>'name') stored not null,
  email text generated always as (data->>'email') stored,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);
create table public.licensing_licences (
  id text primary key,
  data jsonb not null check (jsonb_typeof(data) = 'object'),
  client_id text generated always as (data->>'clientId') stored not null references public.licensing_clients(id),
  licence_id text generated always as (data->>'licId') stored not null unique,
  machine_code text generated always as (data->>'machine') stored not null check (machine_code ~ '^SR-[0-9A-F]{4}(-[0-9A-F]{4}){3}$'),
  licence_type text generated always as (data->>'type') stored not null,
  status text generated always as (data->>'status') stored not null check (status in ('active', 'revoked', 'transferred')),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id),
  constraint lifetime_only check (licence_type = 'perpetual' and coalesce(data->>'expires', '') = ''),
  constraint signed_key_required check (coalesce(data->>'key', '') like 'SRD1.%')
);
create index on public.licensing_licences(machine_code);
create index on public.licensing_licences(client_id);
alter table public.licensing_clients enable row level security;
alter table public.licensing_licences enable row level security;
create policy "Licensing admins" on public.licensing_clients for all to authenticated
  using (public.is_academy_admin()) with check (public.is_academy_admin());
create policy "Licensing admins" on public.licensing_licences for all to authenticated
  using (public.is_academy_admin()) with check (public.is_academy_admin());
grant select, insert, update, delete on public.licensing_clients, public.licensing_licences to authenticated;
revoke all on public.licensing_clients, public.licensing_licences from anon;

-- A transfer or backup import commits completely or rolls back completely.
-- Optimistic versions prevent another administrator's edits being overwritten.
create function public.save_licensing_records(records jsonb)
returns void language plpgsql security invoker set search_path = public as $$
declare r jsonb; table_name text; affected integer;
begin
  if not public.is_academy_admin() then raise exception 'Administrator access required'; end if;
  for r in select value from jsonb_array_elements(records) loop
    table_name := case r->>'collection' when 'clients' then 'licensing_clients' when 'licences' then 'licensing_licences' else null end;
    if table_name is null then raise exception 'Unknown collection'; end if;
    if r->>'version' is null then
      execute format('insert into public.%I(id, data, updated_by) values ($1, $2, auth.uid())', table_name)
        using r->>'id', r->'data';
    else
      execute format('update public.%I set data=$2, updated_at=clock_timestamp(), updated_by=auth.uid() where id=$1 and updated_at=$3', table_name)
        using r->>'id', r->'data', (r->>'version')::timestamptz;
      get diagnostics affected = row_count;
      if affected <> 1 then raise exception 'Record changed. Reload before saving again.'; end if;
    end if;
  end loop;
end;
$$;
revoke all on function public.save_licensing_records(jsonb) from public, anon;
grant execute on function public.save_licensing_records(jsonb) to authenticated;
commit;

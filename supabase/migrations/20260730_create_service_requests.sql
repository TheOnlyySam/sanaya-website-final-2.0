-- Public service requests and internal rate limiting.
-- Apply with the Supabase CLI or run this file in the Supabase SQL editor.

create extension if not exists pgcrypto;

create table if not exists public.service_requests (
  id uuid primary key default gen_random_uuid(),
  public_reference text not null unique check (public_reference ~ '^SNY-[0-9]{4}-[A-F0-9]{6}$'),
  customer_name text not null,
  company_name text,
  phone text not null,
  email text not null,
  governorate text,
  package_id text not null,
  package_name_snapshot text not null,
  package_price_snapshot_iqd bigint check (package_price_snapshot_iqd is null or package_price_snapshot_iqd >= 0),
  service_type text not null,
  odoo_version text,
  hosting_type text,
  preferred_contact_method text not null,
  preferred_contact_date date,
  preferred_contact_time time,
  description text not null,
  attachment_metadata jsonb,
  language text not null default 'ar' check (language in ('ar', 'en')),
  status text not null default 'new' check (status in ('new', 'contacted', 'awaiting_payment', 'scheduled', 'in_progress', 'completed', 'cancelled')),
  internal_notes text not null default '',
  source_page text not null default '/service-request',
  request_hash text not null,
  email_delivery_status text not null default 'pending' check (email_delivery_status in ('pending', 'sent', 'failed')),
  customer_confirmation_delivery_status text not null default 'pending' check (customer_confirmation_delivery_status in ('pending', 'sent', 'failed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists service_requests_created_at_idx on public.service_requests(created_at desc);
create index if not exists service_requests_status_idx on public.service_requests(status, created_at desc);
create index if not exists service_requests_package_idx on public.service_requests(package_id, created_at desc);
create index if not exists service_requests_type_idx on public.service_requests(service_type, created_at desc);
create index if not exists service_requests_hash_idx on public.service_requests(request_hash, created_at desc);

alter table public.service_requests enable row level security;

drop policy if exists "Admins can read service requests" on public.service_requests;
create policy "Admins can read service requests"
on public.service_requests for select
to authenticated
using (public.is_academy_admin());

drop policy if exists "Admins can update service requests" on public.service_requests;
create policy "Admins can update service requests"
on public.service_requests for update
to authenticated
using (public.is_academy_admin())
with check (public.is_academy_admin());

grant select, update on public.service_requests to authenticated;

create table if not exists public.service_request_rate_limits (
  ip_hash text primary key,
  window_started_at timestamptz not null,
  request_count integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.service_request_rate_limits enable row level security;

create or replace function public.consume_service_request_rate_limit(
  p_ip_hash text,
  p_limit integer,
  p_window_seconds integer
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  current_row public.service_request_rate_limits%rowtype;
begin
  if p_ip_hash !~ '^[a-f0-9]{64}$' or p_limit < 1 or p_window_seconds < 60 then
    return false;
  end if;

  delete from public.service_request_rate_limits
  where updated_at < now() - interval '7 days';

  insert into public.service_request_rate_limits (ip_hash, window_started_at, request_count)
  values (p_ip_hash, now(), 1)
  on conflict (ip_hash) do update
  set
    window_started_at = case
      when service_request_rate_limits.window_started_at <= now() - make_interval(secs => p_window_seconds) then now()
      else service_request_rate_limits.window_started_at
    end,
    request_count = case
      when service_request_rate_limits.window_started_at <= now() - make_interval(secs => p_window_seconds) then 1
      else service_request_rate_limits.request_count + 1
    end,
    updated_at = now()
  returning * into current_row;

  return current_row.request_count <= p_limit;
end;
$$;

revoke all on function public.consume_service_request_rate_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.consume_service_request_rate_limit(text, integer, integer) to service_role;

-- Keep operational rate-limit records bounded without retaining raw IP addresses.
delete from public.service_request_rate_limits where updated_at < now() - interval '7 days';

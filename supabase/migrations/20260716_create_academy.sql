-- Sanaya Academy
-- Run this entire file in the Supabase SQL editor, or apply it with the Supabase CLI.

create extension if not exists pgcrypto;

create table if not exists public.academy_sections (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description text not null default '',
  image_url text not null default '',
  position integer not null default 10,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.academy_playlists (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references public.academy_sections(id) on delete cascade,
  title text not null,
  slug text not null check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description text not null default '',
  thumbnail_url text not null default '',
  position integer not null default 10,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (section_id, slug)
);

create table if not exists public.academy_videos (
  id uuid primary key default gen_random_uuid(),
  playlist_id uuid not null references public.academy_playlists(id) on delete cascade,
  title text not null,
  youtube_url text not null,
  youtube_video_id text not null check (youtube_video_id ~ '^[A-Za-z0-9_-]{11}$'),
  description text not null default '',
  notes text not null default '',
  duration_label text not null default '',
  position integer not null default 10,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.academy_attachments (
  id uuid primary key default gen_random_uuid(),
  video_id uuid not null references public.academy_videos(id) on delete cascade,
  title text not null,
  url text not null check (url ~* '^https?://'),
  kind text not null default 'link',
  position integer not null default 10,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists academy_playlists_section_order_idx on public.academy_playlists(section_id, position);
create index if not exists academy_videos_playlist_order_idx on public.academy_videos(playlist_id, position);
create index if not exists academy_attachments_video_order_idx on public.academy_attachments(video_id, position);

alter table public.academy_sections enable row level security;
alter table public.academy_playlists enable row level security;
alter table public.academy_videos enable row level security;
alter table public.academy_attachments enable row level security;

-- Uses the same role table as Sanaya Files. SECURITY DEFINER lets policies check it
-- without granting anonymous visitors any access to that table.
create or replace function public.is_academy_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.sanaya_file_user_roles
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      and role = 'admin'
  );
$$;

revoke all on function public.is_academy_admin() from public;
grant execute on function public.is_academy_admin() to anon, authenticated;

drop policy if exists "Public can read published academy sections" on public.academy_sections;
create policy "Public can read published academy sections"
on public.academy_sections for select
using (is_published or public.is_academy_admin());

drop policy if exists "Public can read published academy playlists" on public.academy_playlists;
create policy "Public can read published academy playlists"
on public.academy_playlists for select
using (
  public.is_academy_admin()
  or (
    is_published
    and exists (
      select 1 from public.academy_sections section
      where section.id = section_id and section.is_published
    )
  )
);

drop policy if exists "Public can read published academy videos" on public.academy_videos;
create policy "Public can read published academy videos"
on public.academy_videos for select
using (
  public.is_academy_admin()
  or (
    is_published
    and exists (
      select 1
      from public.academy_playlists playlist
      join public.academy_sections section on section.id = playlist.section_id
      where playlist.id = playlist_id
        and playlist.is_published
        and section.is_published
    )
  )
);

drop policy if exists "Public can read resources for published academy videos" on public.academy_attachments;
create policy "Public can read resources for published academy videos"
on public.academy_attachments for select
using (
  public.is_academy_admin()
  or exists (
    select 1
    from public.academy_videos video
    join public.academy_playlists playlist on playlist.id = video.playlist_id
    join public.academy_sections section on section.id = playlist.section_id
    where video.id = video_id
      and video.is_published
      and playlist.is_published
      and section.is_published
  )
);

drop policy if exists "Admins can insert academy sections" on public.academy_sections;
drop policy if exists "Admins can update academy sections" on public.academy_sections;
drop policy if exists "Admins can delete academy sections" on public.academy_sections;
create policy "Admins can insert academy sections" on public.academy_sections for insert with check (public.is_academy_admin());
create policy "Admins can update academy sections" on public.academy_sections for update using (public.is_academy_admin()) with check (public.is_academy_admin());
create policy "Admins can delete academy sections" on public.academy_sections for delete using (public.is_academy_admin());

drop policy if exists "Admins can insert academy playlists" on public.academy_playlists;
drop policy if exists "Admins can update academy playlists" on public.academy_playlists;
drop policy if exists "Admins can delete academy playlists" on public.academy_playlists;
create policy "Admins can insert academy playlists" on public.academy_playlists for insert with check (public.is_academy_admin());
create policy "Admins can update academy playlists" on public.academy_playlists for update using (public.is_academy_admin()) with check (public.is_academy_admin());
create policy "Admins can delete academy playlists" on public.academy_playlists for delete using (public.is_academy_admin());

drop policy if exists "Admins can insert academy videos" on public.academy_videos;
drop policy if exists "Admins can update academy videos" on public.academy_videos;
drop policy if exists "Admins can delete academy videos" on public.academy_videos;
create policy "Admins can insert academy videos" on public.academy_videos for insert with check (public.is_academy_admin());
create policy "Admins can update academy videos" on public.academy_videos for update using (public.is_academy_admin()) with check (public.is_academy_admin());
create policy "Admins can delete academy videos" on public.academy_videos for delete using (public.is_academy_admin());

drop policy if exists "Admins can insert academy attachments" on public.academy_attachments;
drop policy if exists "Admins can update academy attachments" on public.academy_attachments;
drop policy if exists "Admins can delete academy attachments" on public.academy_attachments;
create policy "Admins can insert academy attachments" on public.academy_attachments for insert with check (public.is_academy_admin());
create policy "Admins can update academy attachments" on public.academy_attachments for update using (public.is_academy_admin()) with check (public.is_academy_admin());
create policy "Admins can delete academy attachments" on public.academy_attachments for delete using (public.is_academy_admin());

grant select on public.academy_sections, public.academy_playlists, public.academy_videos, public.academy_attachments to anon;
grant select, insert, update, delete on public.academy_sections, public.academy_playlists, public.academy_videos, public.academy_attachments to authenticated;

-- Safe seed: it only creates the starter hierarchy when those slugs do not exist.
insert into public.academy_sections (name, slug, description, position, is_published)
values ('Odoo', 'odoo', 'Guided lessons for using and managing Odoo business applications.', 10, true)
on conflict (slug) do nothing;

insert into public.academy_playlists (section_id, title, slug, description, position, is_published)
select id, 'Odoo Essentials', 'odoo-essentials', 'Start here for practical Odoo workflows and fundamentals.', 10, true
from public.academy_sections
where slug = 'odoo'
on conflict (section_id, slug) do nothing;

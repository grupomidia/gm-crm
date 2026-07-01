create extension if not exists "uuid-ossp";

create table if not exists events (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  description text,
  location text,
  starts_at timestamptz,
  active boolean default true,
  created_at timestamptz default now()
);

create table if not exists contacts (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  phone text,
  company text,
  role text,
  segment text,
  tags text[] default '{}',
  created_at timestamptz default now(),
  unique(email)
);

create table if not exists form_responses (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid references events(id) on delete cascade,
  contact_id uuid references contacts(id) on delete set null,
  status text default 'confirmado',
  answers jsonb default '{}',
  logistics jsonb default '{}',
  token text,
  created_at timestamptz default now()
);

create table if not exists checkins (
  id uuid primary key default uuid_generate_v4(),
  response_id uuid references form_responses(id) on delete cascade,
  checked_at timestamptz default now()
);

alter table events enable row level security;
alter table contacts enable row level security;
alter table form_responses enable row level security;
alter table checkins enable row level security;

create policy "Public can read active events" on events for select using (active = true);
create policy "Public can insert contacts" on contacts for insert with check (true);
create policy "Public can upsert contacts" on contacts for update using (true);
create policy "Public can insert responses" on form_responses for insert with check (true);
create policy "Public can read responses" on form_responses for select using (true);
create policy "Public can read contacts" on contacts for select using (true);
create policy "Public can insert checkins" on checkins for insert with check (true);
create policy "Public can read checkins" on checkins for select using (true);

insert into events (title, slug, description, location, starts_at)
values ('Healthcare Conference 2026', 'healthcare-conference-2026', 'Confirmação de presença para evento do Grupo Mídia.', 'São Paulo, SP', '2026-08-20 09:00:00-03')
on conflict (slug) do nothing;

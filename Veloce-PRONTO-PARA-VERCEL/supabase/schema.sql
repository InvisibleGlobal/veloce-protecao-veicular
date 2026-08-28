create extension if not exists "pgcrypto";
create type event_status as enum ('entrada','documentos','analise','vistoria','aprovacao','execucao','concluido','cancelado');

create table organizations (
  id uuid primary key default gen_random_uuid(), name text not null,
  created_at timestamptz not null default now()
);
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  organization_id uuid not null references organizations(id), full_name text not null,
  role text not null check (role in ('admin','gestor','analista','prestador'))
);
create table members (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references organizations(id),
  full_name text not null, cpf text, phone text, email text, created_at timestamptz not null default now()
);
create table vehicles (
  id uuid primary key default gen_random_uuid(), member_id uuid not null references members(id),
  plate text not null, brand text, model text, year integer
);
create table events (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references organizations(id),
  member_id uuid not null references members(id), vehicle_id uuid not null references vehicles(id),
  owner_id uuid references profiles(id), public_code text unique not null,
  category text not null, status event_status not null default 'entrada',
  priority text not null default 'normal', sla_due_at timestamptz, created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table event_history (
  id uuid primary key default gen_random_uuid(), event_id uuid not null references events(id) on delete cascade,
  actor_id uuid references profiles(id), from_status event_status, to_status event_status,
  note text, created_at timestamptz not null default now()
);
create table documents (
  id uuid primary key default gen_random_uuid(), event_id uuid not null references events(id) on delete cascade,
  storage_key text not null, kind text not null, status text not null default 'pending',
  created_at timestamptz not null default now()
);
alter table organizations enable row level security;
alter table profiles enable row level security;
alter table members enable row level security;
alter table vehicles enable row level security;
alter table events enable row level security;
alter table event_history enable row level security;
alter table documents enable row level security;
create policy "organization events" on events for all using (
  organization_id = (select organization_id from profiles where id = auth.uid())
) with check (
  organization_id = (select organization_id from profiles where id = auth.uid())
);

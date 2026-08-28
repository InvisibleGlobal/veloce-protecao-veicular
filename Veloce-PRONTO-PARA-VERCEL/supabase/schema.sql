-- Estrutura opcional para persistência compartilhada quando o projeto for conectado ao Supabase.
create table if not exists associates (
  id text primary key,
  name text not null,
  cpf text,
  phone text,
  email text,
  vehicle text,
  plate text,
  city text,
  status text default 'Ativo',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists events (
  id text primary key,
  associate text not null,
  vehicle text,
  plate text,
  city text,
  stage text not null,
  sla text not null,
  owner text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

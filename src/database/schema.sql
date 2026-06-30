create table profiles (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'Você',
  start_weight numeric,
  current_weight numeric,
  goal_weight numeric,
  started_at date,
  created_at timestamptz not null default now()
);

create table daily_entries (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  date date not null,
  status text not null check (status in ('none', 'workout', 'cardio', 'both', 'rest')),
  weight numeric,
  workout_minutes integer,
  cardio_minutes integer,
  total_load numeric not null default 0,
  notes text not null default '',
  created_at timestamptz not null default now(),
  unique(profile_id, date)
);

create table exercise_logs (
  id uuid primary key default gen_random_uuid(),
  daily_entry_id uuid not null references daily_entries(id) on delete cascade,
  exercise_id text not null,
  name text not null,
  sets integer not null,
  reps text not null default '',
  load numeric,
  created_at timestamptz not null default now()
);

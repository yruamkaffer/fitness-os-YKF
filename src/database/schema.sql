create table if not exists profiles (
  id text primary key default 'default',
  name text not null default 'Você',
  start_weight numeric,
  current_weight numeric,
  goal_weight numeric,
  started_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists daily_entries (
  profile_id text not null references profiles(id) on delete cascade,
  date date not null,
  status text not null check (status in ('none', 'workout', 'cardio', 'both', 'rest')),
  weight numeric,
  workout_minutes integer,
  cardio_minutes integer,
  total_load numeric not null default 0,
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (profile_id, date)
);

create table if not exists exercise_logs (
  id bigint generated always as identity primary key,
  profile_id text not null references profiles(id) on delete cascade,
  entry_date date not null,
  exercise_id text not null,
  name text not null,
  sets integer not null,
  reps text not null default '',
  load numeric,
  created_at timestamptz not null default now(),
  foreign key (profile_id, entry_date) references daily_entries(profile_id, date) on delete cascade
);

create index if not exists daily_entries_profile_date_idx on daily_entries(profile_id, date);
create index if not exists exercise_logs_profile_date_idx on exercise_logs(profile_id, entry_date);

-- For a private personal app, keep the Supabase project private and use only your anon key in Vercel.
-- If you enable RLS later, add policies scoped to authenticated users before collecting sensitive data.

create table profiles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  start_weight numeric,
  current_weight numeric,
  goal_weight numeric,
  started_at date,
  weekly_workout_goal integer not null default 5,
  weekly_cardio_goal integer not null default 3,
  created_at timestamptz not null default now()
);

create table daily_entries (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  date date not null,
  status text not null check (status in ('none', 'workout', 'cardio', 'both', 'rest', 'sick', 'travel')),
  weight numeric,
  mood integer default 3,
  energy integer default 3,
  workout_minutes integer default 0,
  cardio_minutes integer default 0,
  cardio_calories integer default 0,
  total_load numeric default 0,
  notes text,
  vitamins boolean default false,
  created_at timestamptz not null default now(),
  unique(profile_id, date)
);

create table workout_plans (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  weekday integer not null check (weekday between 0 and 6),
  label text not null,
  focus text not null,
  estimated_minutes integer default 0,
  created_at timestamptz not null default now()
);

create table exercises (
  id uuid primary key default gen_random_uuid(),
  workout_plan_id uuid not null references workout_plans(id) on delete cascade,
  name text not null,
  sets integer not null,
  reps text not null,
  load numeric default 0,
  rpe numeric default 7,
  rest_seconds integer default 90,
  pr numeric default 0,
  created_at timestamptz not null default now()
);

create table goals (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  label text not null,
  current numeric not null default 0,
  target numeric not null,
  unit text not null,
  created_at timestamptz not null default now()
);

create table achievements (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  label text not null,
  description text not null,
  unlocked boolean not null default false,
  progress numeric not null default 0,
  created_at timestamptz not null default now()
);

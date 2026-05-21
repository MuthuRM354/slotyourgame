-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- TEAMS (defined before profiles so FK works)
create table public.teams (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  short_name text,
  captain_id uuid,
  home_ground text,
  created_at timestamptz default now()
);

-- PROFILES (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text not null,
  role text not null check (role in ('league_admin', 'captain', 'player')),
  team_id uuid references public.teams(id),
  cricheroes_id text,
  cricheroes_verified boolean default false,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Add deferred FK from teams.captain_id → profiles
alter table public.teams
  add constraint teams_captain_id_fkey
  foreign key (captain_id) references public.profiles(id);

-- FIXTURES
create table public.fixtures (
  id uuid default uuid_generate_v4() primary key,
  team_id uuid references public.teams(id) not null,
  opponent_name text not null,
  fixture_date date not null,
  start_time time,
  end_time time,
  ground_name text,
  ground_address text,
  fixture_type text check (fixture_type in ('match', 'nets', 'tournament')),
  status text default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  kit_manager_id uuid references public.profiles(id),
  umpire_name text,
  notes text,
  created_by uuid references public.profiles(id),
  created_at timestamptz default now()
);

-- AVAILABILITY
create table public.availability (
  id uuid default uuid_generate_v4() primary key,
  fixture_id uuid references public.fixtures(id) on delete cascade not null,
  player_id uuid references public.profiles(id) on delete cascade not null,
  status text default 'pending' check (status in ('available', 'unavailable', 'pending')),
  responded_at timestamptz,
  unique(fixture_id, player_id)
);

-- PLAYER STATS
create table public.player_stats (
  id uuid default uuid_generate_v4() primary key,
  player_id uuid references public.profiles(id) not null,
  fixture_id uuid references public.fixtures(id) not null,
  runs_scored int default 0,
  balls_faced int default 0,
  wickets_taken int default 0,
  overs_bowled decimal(4,1) default 0,
  catches int default 0,
  stumpings int default 0,
  created_at timestamptz default now()
);

-- ─── Row Level Security ───────────────────────────────────────────────────────

alter table public.profiles enable row level security;
alter table public.teams enable row level security;
alter table public.fixtures enable row level security;
alter table public.availability enable row level security;
alter table public.player_stats enable row level security;

-- PROFILES policies
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "League admins view all profiles" on public.profiles
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'league_admin')
  );

create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- TEAMS policies
create policy "Team members view own team" on public.teams
  for select using (
    id in (select team_id from public.profiles where id = auth.uid())
  );

create policy "League admins view all teams" on public.teams
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'league_admin')
  );

create policy "League admins manage teams" on public.teams
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'league_admin')
  );

-- FIXTURES policies
create policy "Team members view own team fixtures" on public.fixtures
  for select using (
    team_id in (select team_id from public.profiles where id = auth.uid())
  );

create policy "Captains and admins create fixtures" on public.fixtures
  for insert with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('captain', 'league_admin')
    )
  );

create policy "Captains and admins update fixtures" on public.fixtures
  for update using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('captain', 'league_admin')
    )
  );

-- AVAILABILITY policies
create policy "Team members view team availability" on public.availability
  for select using (
    fixture_id in (
      select f.id from public.fixtures f
      join public.profiles p on p.team_id = f.team_id
      where p.id = auth.uid()
    )
  );

create policy "Players insert own availability" on public.availability
  for insert with check (player_id = auth.uid());

create policy "Players update own availability" on public.availability
  for update using (player_id = auth.uid());

-- PLAYER STATS policies
create policy "Team members view team stats" on public.player_stats
  for select using (
    fixture_id in (
      select f.id from public.fixtures f
      join public.profiles p on p.team_id = f.team_id
      where p.id = auth.uid()
    )
  );

create policy "Captains and admins insert stats" on public.player_stats
  for insert with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('captain', 'league_admin')
    )
  );

-- ─── Trigger: auto-create profile on signup ──────────────────────────────────
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', 'New Player'),
    coalesce(new.raw_user_meta_data->>'role', 'player')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

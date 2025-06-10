create table if not exists profiles (
  user_id uuid references auth.users not null primary key,
  role text not null
);
alter table profiles enable row level security;
create policy "Users can read own profile"
  on profiles for select
  using (auth.uid() = user_id);
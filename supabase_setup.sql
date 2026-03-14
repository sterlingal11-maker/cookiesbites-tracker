-- Run this in your Supabase project → SQL Editor

-- 1. Create the app_data table
create table if not exists app_data (
  key   text primary key,
  value jsonb not null
);

-- 2. Disable Row Level Security (this is a private single-owner app)
--    The anon key is only shared with the owner via Vercel env vars
alter table app_data disable row level security;

-- 3. (Optional) Verify the table was created
select * from app_data;

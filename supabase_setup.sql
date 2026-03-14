-- Run this in your Supabase project → SQL Editor
-- Safe to run alongside any other app (Delightful Meals etc.) —
-- the "cb_" prefix ensures this table never conflicts with anything else.

-- 1. Create the Cookie's Bites data table
create table if not exists cb_app_data (
  key   text primary key,
  value jsonb not null
);

-- 2. Disable Row Level Security (single-owner private app)
--    Access is controlled by keeping the anon key private in Vercel env vars
alter table cb_app_data disable row level security;

-- 3. Verify
select * from cb_app_data;

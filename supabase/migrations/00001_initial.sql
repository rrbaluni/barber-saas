-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- Bookings table
create table if not exists bookings (
  id uuid primary key default uuid_generate_v4(),
  customer_name text not null,
  customer_email text not null default '',
  customer_phone text not null default '',
  service_id text not null,
  barber_id text not null,
  date text not null,
  time text not null,
  status text not null default 'confirmed' check (status in ('confirmed', 'completed', 'cancelled')),
  notes text default '',
  created_at timestamptz not null default now()
);

-- Sessions table (admin auth sessions)
create table if not exists sessions (
  token text primary key,
  email text not null default '',
  expires bigint not null
);

-- Index for faster booking lookups by date
create index if not exists idx_bookings_date on bookings (date);

-- Index for session expiry cleanup
create index if not exists idx_sessions_expires on sessions (expires);

-- BDS PostgreSQL schema (core scheduling, booking, payments, and messaging)
create extension if not exists "uuid-ossp";
create extension if not exists "citext";

create type user_role as enum ("member", "instructor", "admin");
create type class_level as enum ("all_levels", "beginner", "intermediate", "advanced");
create type session_status as enum ("scheduled", "cancelled", "completed");
create type booking_status as enum ("reserved", "checked_in", "no_show", "cancelled");
create type payment_status as enum ("pending", "paid", "refunded", "failed");
create type membership_status as enum ("active", "paused", "cancelled", "expired");

create table users (
  id uuid primary key default uuid_generate_v4(),
  email citext unique not null,
  password_hash text not null,
  role user_role not null default "member",
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table member_profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  phone text,
  birthdate date,
  emergency_contact_name text,
  emergency_contact_phone text,
  marketing_opt_in boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table instructor_profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  display_name text not null,
  bio text,
  specialty text,
  years_experience integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table locations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  address_line1 text not null,
  address_line2 text,
  city text not null,
  state text not null,
  postal_code text not null,
  phone text,
  timezone text not null default 'America/Los_Angeles',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table rooms (
  id uuid primary key default uuid_generate_v4(),
  location_id uuid not null references locations(id) on delete cascade,
  name text not null,
  capacity integer not null default 25,
  created_at timestamptz not null default now()
);

create table class_types (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  level class_level not null default "all_levels",
  duration_minutes integer not null default 60,
  intensity integer not null default 3,
  color_hex text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table class_sessions (
  id uuid primary key default uuid_generate_v4(),
  class_type_id uuid not null references class_types(id),
  room_id uuid not null references rooms(id),
  instructor_id uuid references instructor_profiles(id),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  capacity integer not null default 25,
  status session_status not null default "scheduled",
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table bookings (
  id uuid primary key default uuid_generate_v4(),
  member_id uuid not null references member_profiles(id) on delete cascade,
  class_session_id uuid not null references class_sessions(id) on delete cascade,
  status booking_status not null default "reserved",
  booked_at timestamptz not null default now(),
  checked_in_at timestamptz,
  cancelled_at timestamptz,
  unique (member_id, class_session_id)
);

create table waitlists (
  id uuid primary key default uuid_generate_v4(),
  member_id uuid not null references member_profiles(id) on delete cascade,
  class_session_id uuid not null references class_sessions(id) on delete cascade,
  position integer not null,
  created_at timestamptz not null default now(),
  unique (member_id, class_session_id)
);

create table membership_plans (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  price_cents integer not null,
  billing_interval text not null,
  class_limit integer,
  description text,
  created_at timestamptz not null default now()
);

create table memberships (
  id uuid primary key default uuid_generate_v4(),
  member_id uuid not null references member_profiles(id) on delete cascade,
  plan_id uuid not null references membership_plans(id),
  status membership_status not null default "active",
  starts_on date not null,
  ends_on date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table class_packs (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  total_classes integer not null,
  price_cents integer not null,
  expires_in_days integer not null default 60,
  created_at timestamptz not null default now()
);

create table member_packs (
  id uuid primary key default uuid_generate_v4(),
  member_id uuid not null references member_profiles(id) on delete cascade,
  class_pack_id uuid not null references class_packs(id),
  remaining_classes integer not null,
  purchased_at timestamptz not null default now(),
  expires_at timestamptz
);

create table payments (
  id uuid primary key default uuid_generate_v4(),
  member_id uuid not null references member_profiles(id) on delete cascade,
  amount_cents integer not null,
  currency text not null default 'USD',
  status payment_status not null default "pending",
  provider text,
  provider_reference text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table payment_items (
  id uuid primary key default uuid_generate_v4(),
  payment_id uuid not null references payments(id) on delete cascade,
  item_type text not null,
  item_id uuid,
  amount_cents integer not null
);

create table waivers (
  id uuid primary key default uuid_generate_v4(),
  member_id uuid not null references member_profiles(id) on delete cascade,
  signed_at timestamptz not null default now(),
  signed_ip text,
  waiver_text text not null
);

create table private_sessions (
  id uuid primary key default uuid_generate_v4(),
  member_id uuid not null references member_profiles(id) on delete cascade,
  instructor_id uuid not null references instructor_profiles(id),
  location_id uuid not null references locations(id),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  notes text,
  status session_status not null default "scheduled",
  created_at timestamptz not null default now()
);

create table contact_messages (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email citext not null,
  phone text,
  inquiry_type text,
  message text not null,
  created_at timestamptz not null default now()
);

create index idx_class_sessions_starts_at on class_sessions(starts_at);
create index idx_bookings_member on bookings(member_id);
create index idx_bookings_session on bookings(class_session_id);
create index idx_waitlists_session on waitlists(class_session_id);

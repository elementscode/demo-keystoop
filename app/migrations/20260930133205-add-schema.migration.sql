-- add schema

-- Auto-update updatedAt on row changes.
create or replace function touchUpdatedAt()
returns trigger
language plpgsql
as $$
begin
  new.updatedAt = now();
  return new;
end;
$$;

create type userRole as enum ('buyer', 'agent');

create table users (
  id uuid primary key default uuidGenerateV7(),
  createdAt timestamptz not null default now(),
  updatedAt timestamptz not null default now(),
  email text not null unique,
  passwordHash text not null,
  name text not null,
  role userRole not null default 'buyer',
  phone text,
  title text,
  bio text,
  -- Seeded agents carry a static headshot key; see app/shared/services/assets.ts.
  photo text
);

create trigger usersTouchUpdatedAt
  before update on users
  for each row execute function touchUpdatedAt();

create type listingStatus as enum ('active', 'pending', 'sold');

create table listings (
  id uuid primary key default uuidGenerateV7(),
  createdAt timestamptz not null default now(),
  updatedAt timestamptz not null default now(),
  agentId uuid not null references users (id),
  status listingStatus not null default 'active',
  address text not null,
  neighborhood text not null,
  propertyType text not null check (propertyType in ('house', 'condo', 'townhouse')),
  price integer not null check (price > 0),
  beds integer not null check (beds >= 0),
  baths real not null check (baths >= 0),
  sqft integer not null check (sqft > 0),
  lotSqft integer,
  yearBuilt integer,
  headline text not null default '',
  description text not null default '',
  listedAt timestamptz not null default now(),
  soldAt timestamptz
);

create index listingsAgentIdx on listings (agentId);

create trigger listingsTouchUpdatedAt
  before update on listings
  for each row execute function touchUpdatedAt();

create table photos (
  id uuid primary key default uuidGenerateV7(),
  createdAt timestamptz not null default now(),
  updatedAt timestamptz not null default now(),
  listingId uuid not null references listings (id) on delete cascade,
  position integer not null default 0,
  -- A photo is either a static asset key (seed rows) or uploaded bytes.
  asset text,
  contentType text,
  data bytea,
  hash text generated always as (encode(sha256(coalesce(data, ''::bytea)), 'hex')) stored,
  check ((asset is null) <> (data is null))
);

create index photosListingIdx on photos (listingId, position);

create trigger photosTouchUpdatedAt
  before update on photos
  for each row execute function touchUpdatedAt();

create table openHouses (
  id uuid primary key default uuidGenerateV7(),
  createdAt timestamptz not null default now(),
  updatedAt timestamptz not null default now(),
  listingId uuid not null references listings (id) on delete cascade,
  startsAt timestamptz not null,
  endsAt timestamptz not null,
  check (endsAt > startsAt)
);

create index openHousesListingIdx on openHouses (listingId, startsAt);

create trigger openHousesTouchUpdatedAt
  before update on openHouses
  for each row execute function touchUpdatedAt();

create type inquiryKind as enum ('question', 'showing');

create table inquiries (
  id uuid primary key default uuidGenerateV7(),
  createdAt timestamptz not null default now(),
  updatedAt timestamptz not null default now(),
  listingId uuid not null references listings (id) on delete cascade,
  agentId uuid not null references users (id),
  kind inquiryKind not null default 'question',
  name text not null,
  email text not null,
  phone text not null default '',
  message text not null default '',
  preferredTime text not null default '',
  readAt timestamptz
);

create index inquiriesAgentIdx on inquiries (agentId, createdAt desc);

create trigger inquiriesTouchUpdatedAt
  before update on inquiries
  for each row execute function touchUpdatedAt();

create table favorites (
  id uuid primary key default uuidGenerateV7(),
  createdAt timestamptz not null default now(),
  updatedAt timestamptz not null default now(),
  userId uuid not null references users (id) on delete cascade,
  listingId uuid not null references listings (id) on delete cascade,
  unique (userId, listingId)
);

create trigger favoritesTouchUpdatedAt
  before update on favorites
  for each row execute function touchUpdatedAt();

create table savedSearches (
  id uuid primary key default uuidGenerateV7(),
  createdAt timestamptz not null default now(),
  updatedAt timestamptz not null default now(),
  userId uuid not null references users (id) on delete cascade,
  name text not null,
  minPrice integer,
  maxPrice integer,
  minBeds integer,
  minBaths real,
  propertyType text,
  neighborhood text
);

create index savedSearchesUserIdx on savedSearches (userId);

create trigger savedSearchesTouchUpdatedAt
  before update on savedSearches
  for each row execute function touchUpdatedAt();

-- One row per email sent, so a listing is announced to a saved search once.
create table savedSearchMatches (
  savedSearchId uuid not null references savedSearches (id) on delete cascade,
  listingId uuid not null references listings (id) on delete cascade,
  createdAt timestamptz not null default now(),
  primary key (savedSearchId, listingId)
);

-- Every write to listings reaches open search pages, whatever path made it.
-- The payload is the id alone: the app reads the row back through the
-- LiveTable's select, which joins the cover photo and the agent.
create or replace function listingsNotify() returns trigger
language plpgsql as $$
declare
  r record;
begin
  r := coalesce(new, old);
  perform pg_notify(channel_name('listings'), json_build_object('op', lower(tg_op), 'id', r.id)::text);
  return r;
end;
$$;

create trigger listingsNotifyTrigger
  after insert or update or delete on listings
  for each row execute function listingsNotify();

create or replace function inquiriesNotify() returns trigger
language plpgsql as $$
declare
  r record;
begin
  r := coalesce(new, old);
  perform pg_notify(
    channel_name('inquiries'),
    json_build_object('op', lower(tg_op), 'id', r.id)::text
  );
  return r;
end;
$$;

create trigger inquiriesNotifyTrigger
  after insert or update or delete on inquiries
  for each row execute function inquiriesNotify();

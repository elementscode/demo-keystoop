import { File, ValidationError, NotFoundError, sql, tx } from "@elements/app";
import { NotifySavedSearchesJob } from "#app/jobs/notify-saved-searches";
import { requireAgent } from "#app/shared/services/auth";
import { touchListing } from "#app/shared/services/listings";
import { ListingStatus, NEIGHBORHOODS, PROPERTY_TYPES, TIME_ZONE } from "#app/shared/services/catalog";

export interface AgentListing {
  id: string;
  status: ListingStatus;
  address: string;
  neighborhood: string;
  price: number;
  beds: number;
  baths: number;
  listedAt: Date;
  coverId: string | null;
  coverAsset: string | null;
  coverHash: string | null;
  inquiryCount: number;
}

export interface ListingForm {
  status: ListingStatus;
  address: string;
  neighborhood: string;
  propertyType: string;
  price: string;
  beds: string;
  baths: string;
  sqft: string;
  lotSqft: string;
  yearBuilt: string;
  headline: string;
  description: string;
  photos: File[];
}

export interface EditorPhoto {
  id: string;
  asset: string | null;
  hash: string;
  position: number;
}

export interface EditorOpenHouse {
  id: string;
  startsAt: Date;
  endsAt: Date;
}

const IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/gif", "image/webp"]);

const MAX_PHOTO_BYTES = 8 * 1024 * 1024;

export function emptyListingForm(): ListingForm {
  return {
    status: "active",
    address: "",
    neighborhood: "",
    propertyType: "house",
    price: "",
    beds: "",
    baths: "",
    sqft: "",
    lotSqft: "",
    yearBuilt: "",
    headline: "",
    description: "",
    photos: [],
  };
}

export function myListings(agentId: string): AgentListing[] {
  return sql<AgentListing>(`
    select l.id, l.status, l.address, l.neighborhood, l.price, l.beds, l.baths, l.listedAt,
           c.id as coverId, c.asset as coverAsset, c.hash as coverHash,
           (select count(*)::int from inquiries i where i.listingId = l.id) as inquiryCount
      from listings l
      left join lateral (
        select id, asset, hash from photos where listingId = l.id order by position, createdAt limit 1
      ) c on true
     where l.agentId = ${agentId}
     order by l.listedAt desc
  `).all();
}

/** The listing, if the agent owns it; a 404 otherwise, so ids do not leak. */
export function ownedListing(id: string, agentId: string): { id: string; status: ListingStatus } {
  let row = sql<{ id: string; status: ListingStatus }>(`
    select id, status from listings where id = ${id} and agentId = ${agentId}
  `).first();

  if (!row) {
    throw new NotFoundError("That listing is not one of yours.");
  }

  return row;
}

interface Parsed {
  status: ListingStatus;
  address: string;
  neighborhood: string;
  propertyType: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  lotSqft: number | null;
  yearBuilt: number | null;
  headline: string;
  description: string;
}

export function parseListingForm(form: ListingForm): Parsed {
  let errors: Partial<Record<keyof ListingForm, string[]>> = {};
  let int = (v: string) => (/^\d+$/.test(v.replace(/[,\s$]/g, "")) ? Number(v.replace(/[,\s$]/g, "")) : NaN);

  let price = int(form.price);
  let beds = int(form.beds);
  let baths = Number(form.baths);
  let sqft = int(form.sqft);
  let lotSqft = form.lotSqft.trim() ? int(form.lotSqft) : null;
  let yearBuilt = form.yearBuilt.trim() ? int(form.yearBuilt) : null;

  if (!form.address.trim()) {
    errors.address = ["Enter the street address."];
  }

  if (!NEIGHBORHOODS.includes(form.neighborhood)) {
    errors.neighborhood = ["Pick a neighborhood."];
  }

  if (!PROPERTY_TYPES.some((t) => t.value === form.propertyType)) {
    errors.propertyType = ["Pick a home type."];
  }

  if (!(price > 0)) {
    errors.price = ["Enter the asking price in dollars."];
  }

  if (!(beds >= 0 && beds < 30)) {
    errors.beds = ["Enter the number of bedrooms."];
  }

  if (!(baths >= 0 && baths < 30) || form.baths.trim() === "" || (baths * 2) % 1 !== 0) {
    errors.baths = ["Enter baths in halves, like 2 or 2.5."];
  }

  if (!(sqft > 0)) {
    errors.sqft = ["Enter the finished square feet."];
  }

  if (lotSqft !== null && !(lotSqft > 0)) {
    errors.lotSqft = ["Enter the lot size in square feet, or leave it blank."];
  }

  if (yearBuilt !== null && !(yearBuilt >= 1700 && yearBuilt <= new Date().getFullYear() + 2)) {
    errors.yearBuilt = ["Enter a four-digit year, or leave it blank."];
  }

  if (!["active", "pending", "sold"].includes(form.status)) {
    errors.status = ["Pick a status."];
  }

  if (Object.keys(errors).length > 0) {
    throw new ValidationError(errors);
  }

  return {
    status: form.status,
    address: form.address.trim(),
    neighborhood: form.neighborhood,
    propertyType: form.propertyType,
    price,
    beds,
    baths,
    sqft,
    lotSqft,
    yearBuilt,
    headline: form.headline.trim(),
    description: form.description.trim(),
  };
}

function checkPhotos(files: File[]) {
  for (let f of files) {
    if (!IMAGE_TYPES.has(f.contentType)) {
      throw new ValidationError({ photos: [`${f.name} is not a JPEG, PNG, GIF or WebP image.`] });
    }

    if (f.size > MAX_PHOTO_BYTES) {
      throw new ValidationError({ photos: [`${f.name} is over 8 MB.`] });
    }
  }
}

function insertPhotos(listingId: string, files: File[]) {
  let start = sql<{ n: number }>(`
    select coalesce(max(position) + 1, 0)::int as n from photos where listingId = ${listingId}
  `).firstOrThrow().n;

  files.forEach((f, i) => {
    sql(`
      insert into photos (listingId, position, contentType, data)
           values (${listingId}, ${start + i}, ${f.contentType}, ${f.data})
    `);
  });
}

/** @rpc */
export function createListing(form: ListingForm): { id: string } {
  let agentId = requireAgent();
  let p = parseListingForm(form);

  checkPhotos(form.photos);

  return tx(() => {
    let row = sql<{ id: string }>(`
      insert into listings (agentId, status, address, neighborhood, propertyType, price, beds, baths,
                            sqft, lotSqft, yearBuilt, headline, description, soldAt)
           values (${agentId}, ${p.status}, ${p.address}, ${p.neighborhood}, ${p.propertyType}, ${p.price},
                   ${p.beds}, ${p.baths}, ${p.sqft}, ${p.lotSqft}, ${p.yearBuilt}, ${p.headline},
                   ${p.description}, ${p.status === "sold" ? new Date() : null})
        returning id
    `).firstOrThrow();

    if (form.photos.length > 0) {
      insertPhotos(row.id, form.photos);
      touchListing(row.id);
    }

    if (p.status === "active") {
      new NotifySavedSearchesJob({ listingId: row.id }).schedule();
    }

    return row;
  });
}

/** @rpc */
export function updateListing(id: string, form: ListingForm) {
  let agentId = requireAgent();
  let before = ownedListing(id, agentId);
  let p = parseListingForm(form);

  tx(() => {
    sql(`
      update listings
         set status = ${p.status},
             address = ${p.address},
             neighborhood = ${p.neighborhood},
             propertyType = ${p.propertyType},
             price = ${p.price},
             beds = ${p.beds},
             baths = ${p.baths},
             sqft = ${p.sqft},
             lotSqft = ${p.lotSqft},
             yearBuilt = ${p.yearBuilt},
             headline = ${p.headline},
             description = ${p.description},
             soldAt = case when ${p.status} = 'sold' then coalesce(soldAt, now()) else null end
       where id = ${id}
    `);

    if (p.status === "active" && before.status !== "active") {
      new NotifySavedSearchesJob({ listingId: id }).schedule();
    }
  });
}

/** @rpc */
export function setListingStatus(id: string, status: ListingStatus) {
  let agentId = requireAgent();
  let before = ownedListing(id, agentId);

  if (!["active", "pending", "sold"].includes(status)) {
    throw new ValidationError("Pick a status.");
  }

  tx(() => {
    sql(`
      update listings
         set status = ${status},
             soldAt = case when ${status} = 'sold' then coalesce(soldAt, now()) else null end
       where id = ${id}
    `);

    if (status === "active" && before.status !== "active") {
      new NotifySavedSearchesJob({ listingId: id }).schedule();
    }
  });
}

export function editorPhotos(listingId: string): EditorPhoto[] {
  return sql<EditorPhoto>(`
    select id, asset, hash, position from photos where listingId = ${listingId} order by position, createdAt
  `).all();
}

export function editorOpenHouses(listingId: string): EditorOpenHouse[] {
  return sql<EditorOpenHouse>(`
    select id, startsAt, endsAt from openHouses
     where listingId = ${listingId} and endsAt > now()
     order by startsAt
  `).all();
}

/** @rpc */
export function addPhotos(listingId: string, files: File[]): EditorPhoto[] {
  let agentId = requireAgent();

  ownedListing(listingId, agentId);
  checkPhotos(files);

  tx(() => {
    insertPhotos(listingId, files);
    touchListing(listingId);
  });

  return editorPhotos(listingId);
}

/** @rpc */
export function removePhoto(listingId: string, photoId: string): EditorPhoto[] {
  let agentId = requireAgent();

  ownedListing(listingId, agentId);

  tx(() => {
    sql(`delete from photos where id = ${photoId} and listingId = ${listingId}`);
    touchListing(listingId);
  });

  return editorPhotos(listingId);
}

/** @rpc */
export function makeCover(listingId: string, photoId: string): EditorPhoto[] {
  let agentId = requireAgent();

  ownedListing(listingId, agentId);

  tx(() => {
    sql(`
      update photos
         set position = case when id = ${photoId} then 0 else position + 1 end
       where listingId = ${listingId}
    `);
    touchListing(listingId);
  });

  return editorPhotos(listingId);
}

/** @rpc */
export function addOpenHouse(listingId: string, day: string, start: string, end: string): EditorOpenHouse[] {
  let agentId = requireAgent();

  ownedListing(listingId, agentId);

  if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || !/^\d{2}:\d{2}$/.test(start) || !/^\d{2}:\d{2}$/.test(end)) {
    throw new ValidationError("Pick a date, a start time and an end time.");
  }

  if (end <= start) {
    throw new ValidationError("The open house has to end after it starts.");
  }

  tx(() => {
    sql(`
      insert into openHouses (listingId, startsAt, endsAt)
           values (${listingId},
                   (${day}::date + ${start}::time) at time zone ${TIME_ZONE},
                   (${day}::date + ${end}::time) at time zone ${TIME_ZONE})
    `);
    touchListing(listingId);
  });

  return editorOpenHouses(listingId);
}

/** @rpc */
export function removeOpenHouse(listingId: string, openHouseId: string): EditorOpenHouse[] {
  let agentId = requireAgent();

  ownedListing(listingId, agentId);

  tx(() => {
    sql(`delete from openHouses where id = ${openHouseId} and listingId = ${listingId}`);
    touchListing(listingId);
  });

  return editorOpenHouses(listingId);
}

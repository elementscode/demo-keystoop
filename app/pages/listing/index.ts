import { Request, Response, sql, NotFoundError } from "@elements/app";
import { favoriteIds } from "#app/shared/services/favorites";
import html, { ListingDetail, Photo, OpenHouse, Agent } from "./template";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default function route(req: Request, res: Response) {
  if (!UUID.test(req.params.id)) {
    throw new NotFoundError("That listing is no longer on the market.");
  }

  let listing = sql<ListingDetail>(`
    select id, status, address, neighborhood, propertyType, price, beds, baths, sqft, lotSqft,
           yearBuilt, headline, description, listedAt, soldAt, agentId
      from listings
     where id = ${req.params.id}
  `).first();

  if (!listing) {
    throw new NotFoundError("That listing is no longer on the market.");
  }

  let photos = sql<Photo>(`
    select id, asset, hash from photos where listingId = ${listing.id} order by position, createdAt
  `).all();

  let openHouses = sql<OpenHouse>(`
    select id, startsAt, endsAt from openHouses
     where listingId = ${listing.id} and endsAt > now()
     order by startsAt
  `).all();

  let agent = sql<Agent>(`
    select id, name, email, phone, title, bio, photo from users where id = ${listing.agentId}
  `).firstOrThrow();

  return new html({
    listing,
    photos,
    openHouses,
    agent,
    favorite: favoriteIds().includes(listing.id),
  });
}

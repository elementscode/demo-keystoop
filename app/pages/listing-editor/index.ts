import { Request, Response, NotFoundError, sql } from "@elements/app";
import { requireAgent } from "#app/shared/services/auth";
import {
  ListingForm,
  emptyListingForm,
  ownedListing,
  editorPhotos,
  editorOpenHouses,
} from "#app/shared/services/agent";
import { unreadCount } from "#app/shared/services/inquiries";
import html from "./template";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default function route(req: Request, res: Response) {
  let agentId = requireAgent();
  let unread = unreadCount(agentId);

  if (!req.params.id) {
    return new html({ listingId: "", initial: emptyListingForm(), photos: [], openHouses: [], unread, created: false });
  }

  if (!UUID.test(req.params.id)) {
    throw new NotFoundError("That listing is not one of yours.");
  }

  let listing = ownedListing(req.params.id, agentId);

  let row = sql<Omit<ListingForm, "photos" | "price" | "beds" | "baths" | "sqft" | "lotSqft" | "yearBuilt"> & {
    price: number;
    beds: number;
    baths: number;
    sqft: number;
    lotSqft: number | null;
    yearBuilt: number | null;
  }>(`
    select status, address, neighborhood, propertyType, price, beds, baths, sqft, lotSqft, yearBuilt,
           headline, description
      from listings where id = ${listing.id}
  `).firstOrThrow();

  let str = (v: number | null) => (v === null ? "" : String(v));

  let form: ListingForm = {
    ...row,
    price: str(row.price),
    beds: str(row.beds),
    baths: str(row.baths),
    sqft: str(row.sqft),
    lotSqft: str(row.lotSqft),
    yearBuilt: str(row.yearBuilt),
    photos: [],
  };

  return new html({
    listingId: listing.id,
    initial: form,
    photos: editorPhotos(listing.id),
    openHouses: editorOpenHouses(listing.id),
    unread,
    created: req.query.created === "1",
  });
}

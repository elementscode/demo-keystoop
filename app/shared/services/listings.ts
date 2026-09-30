import { LiveTable, ForbiddenError, sql } from "@elements/app";
import { ListingCard } from "#app/shared/services/catalog";

/**
 * Every listing, as search renders it. Writes never go through the view: an
 * agent's rpc writes the table and the listings trigger broadcasts the id, so
 * the server reads the row back through this select and every open search
 * page updates.
 */
export let listings: LiveTable<ListingCard> = new LiveTable<ListingCard>({
  table: "listings",
  channel: (partition) => (partition ? `listings:${partition}` : "listings"),

  select: (partition, w) => sql<ListingCard>(`
    select l.id,
           l.status,
           l.address,
           l.neighborhood,
           l.propertyType,
           l.price,
           l.beds,
           l.baths,
           l.sqft,
           l.headline,
           l.listedAt,
           l.agentId,
           u.name as agentName,
           c.id as coverId,
           c.asset as coverAsset,
           c.hash as coverHash,
           (select count(*)::int from photos p where p.listingId = l.id) as photoCount,
           (select min(o.startsAt) from openHouses o where o.listingId = l.id and o.endsAt > now()) as nextOpenHouse
      from listings l
      join users u on u.id = l.agentId
      left join lateral (
        select id, asset, hash from photos where listingId = l.id order by position, createdAt limit 1
      ) c on true
     where ${w.keyset("l")}
     order by ${w.order("l")} ${w.page()}
  `),

  insert: () => {
    throw new ForbiddenError();
  },

  update: () => {
    throw new ForbiddenError();
  },

  delete: () => {
    throw new ForbiddenError();
  },
});

/** Touch the listing so its trigger rebroadcasts it, after a photo or open-house change. */
export function touchListing(id: string) {
  sql(`update listings set updatedAt = now() where id = ${id}`);
}

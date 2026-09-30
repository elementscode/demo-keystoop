import { sql } from "@elements/app";

export interface AlertMatch {
  savedSearchId: string;
  searchName: string;
  userName: string;
  userEmail: string;
}

/**
 * The saved searches a listing newly meets, recorded so each search hears
 * about each listing once. Only an active listing is announced.
 */
export function claimMatches(listingId: string): AlertMatch[] {
  return sql<AlertMatch>(`
    with matched as (
      select s.id, s.name, s.userId
        from savedSearches s
        join listings l on l.id = ${listingId}
       where l.status = 'active'
         and (s.minPrice is null or l.price >= s.minPrice)
         and (s.maxPrice is null or l.price <= s.maxPrice)
         and (s.minBeds is null or l.beds >= s.minBeds)
         and (s.minBaths is null or l.baths >= s.minBaths)
         and (s.propertyType is null or l.propertyType = s.propertyType)
         and (s.neighborhood is null or l.neighborhood = s.neighborhood)
    ),
    claimed as (
      insert into savedSearchMatches (savedSearchId, listingId)
           select id, ${listingId} from matched
      on conflict do nothing
        returning savedSearchId
    )
    select m.id as savedSearchId, m.name as searchName, u.name as userName, u.email as userEmail
      from claimed c
      join matched m on m.id = c.savedSearchId
      join users u on u.id = m.userId
  `).all();
}

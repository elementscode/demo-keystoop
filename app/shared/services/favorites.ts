import { sql, session, ValidationError } from "@elements/app";
import { Criteria, Filters, criteriaFromFilters, describeCriteria } from "#app/shared/services/catalog";

export interface SavedSearch extends Criteria {
  id: string;
  name: string;
  createdAt: Date;
}

export function favoriteIds(): string[] {
  if (!session.isLoggedIn()) {
    return [];
  }

  return sql<{ listingId: string }>(`
    select listingId from favorites where userId = ${session.getOrThrow("userId")}
  `).all().map((r) => r.listingId);
}

/** @rpc */
export function toggleFavorite(listingId: string): string[] {
  session.isLoggedInOrThrow();

  let userId = session.getOrThrow("userId");
  let removed = sql(`
    delete from favorites where userId = ${userId} and listingId = ${listingId} returning id
  `).all();

  if (removed.length === 0) {
    sql(`
      insert into favorites (userId, listingId)
           select ${userId}, id from listings where id = ${listingId}
      on conflict do nothing
    `);
  }

  return favoriteIds();
}

export function savedSearches(): SavedSearch[] {
  return sql<SavedSearch>(`
    select id, name, minPrice, maxPrice, minBeds, minBaths, propertyType, neighborhood, createdAt
      from savedSearches
     where userId = ${session.getOrThrow("userId")}
     order by createdAt desc
  `).all();
}

/** @rpc */
export function saveSearch(filters: Filters): SavedSearch {
  session.isLoggedInOrThrow();

  let c = criteriaFromFilters(filters);

  if (c.minPrice !== null && c.maxPrice !== null && c.minPrice > c.maxPrice) {
    throw new ValidationError("The minimum price is above the maximum.");
  }

  return sql<SavedSearch>(`
    insert into savedSearches (userId, name, minPrice, maxPrice, minBeds, minBaths, propertyType, neighborhood)
         values (${session.getOrThrow("userId")},
                 ${describeCriteria(c)},
                 ${c.minPrice},
                 ${c.maxPrice},
                 ${c.minBeds},
                 ${c.minBaths},
                 ${c.propertyType},
                 ${c.neighborhood})
      returning id, name, minPrice, maxPrice, minBeds, minBaths, propertyType, neighborhood, createdAt
  `).firstOrThrow();
}

/** @rpc */
export function deleteSavedSearch(id: string): SavedSearch[] {
  session.isLoggedInOrThrow();
  sql(`delete from savedSearches where id = ${id} and userId = ${session.getOrThrow("userId")}`);

  return savedSearches();
}

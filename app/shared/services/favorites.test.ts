import { test, equal, assert, sql, AuthError } from "@elements/app";
import { toggleFavorite, saveSearch, savedSearches, deleteSavedSearch } from "./favorites";
import { emptyFilters } from "./catalog";
import { makeUser, makeListing, loginAs } from "#app/shared/testing/fixtures";

test("favorites", () => {
  let agent = makeUser("agent");
  let listingId = makeListing(agent.id);

  test("a visitor has to sign in first", () => {
    let threw: unknown;

    try {
      toggleFavorite(listingId);
    } catch (err) {
      threw = err;
    }

    assert(threw instanceof AuthError, `got ${threw}`);
  });

  test("toggling saves and unsaves a home", () => {
    loginAs(makeUser("buyer"));

    equal(toggleFavorite(listingId), [listingId]);
    equal(toggleFavorite(listingId), []);
  });

  test("a saved search stores its criteria and a readable name", () => {
    loginAs(makeUser("buyer"));

    let s = saveSearch({ ...emptyFilters(), hood: "Riverside", beds: "2", maxPrice: "600000" });

    equal(s.name, "Homes in Riverside, under $600K, 2+ beds");
    equal(s.minBeds, 2);
    equal(s.maxPrice, 600000);
    equal(s.minPrice, null);
    equal(savedSearches().length, 1);
    equal(deleteSavedSearch(s.id), []);
  });

  test("another buyer cannot delete my saved search", () => {
    let me = makeUser("buyer");

    loginAs(me);

    let s = saveSearch({ ...emptyFilters(), hood: "Lakeview" });

    loginAs(makeUser("buyer"));
    deleteSavedSearch(s.id);

    equal(sql<{ n: number }>(`select count(*)::int as n from savedSearches where id = ${s.id}`).firstOrThrow().n, 1);
  });
});

import { test, equal, assert } from "@elements/app";
import {
  ListingCard,
  emptyFilters,
  filtersFromQuery,
  filtersToQuery,
  criteriaFromFilters,
  filtersFromCriteria,
  searchResults,
  describeCriteria,
  money,
  shortMoney,
} from "./catalog";

function card(id: string, fields: Partial<ListingCard>): ListingCard {
  return {
    id,
    status: "active",
    address: `${id} Main St`,
    neighborhood: "Old Town",
    propertyType: "house",
    price: 500000,
    beds: 3,
    baths: 2,
    sqft: 1500,
    headline: "",
    listedAt: new Date("2026-09-01"),
    agentId: "a",
    agentName: "Ada",
    coverId: null,
    coverAsset: null,
    coverHash: null,
    photoCount: 0,
    nextOpenHouse: null,
    ...fields,
  };
}

test("catalog", () => {
  test("query params become filters, and junk is dropped", () => {
    let f = filtersFromQuery({ minPrice: "400000", beds: "3", hood: "Old Town", type: "castle", sort: "price-asc", baths: "x" });

    equal(f.minPrice, "400000");
    equal(f.beds, "3");
    equal(f.hood, "Old Town");
    equal(f.type, "");
    equal(f.baths, "");
    equal(f.sort, "price-asc");
    equal(f.show, "sale");
  });

  test("filters round-trip through the query string", () => {
    let f = { ...emptyFilters(), maxPrice: "800000", type: "condo", hood: "West End", show: "sold" as const };
    let q = filtersToQuery(f);
    let params = Object.fromEntries(new URLSearchParams(q.slice(1)));

    equal(filtersFromQuery(params), f);
    equal(filtersToQuery(emptyFilters()), "");
  });

  test("saved criteria round-trip through filters", () => {
    let f = { ...emptyFilters(), minPrice: "300000", beds: "2", baths: "1.5", hood: "Riverside" };

    equal(filtersFromCriteria(criteriaFromFilters(f)), f);
  });

  test("search filters by every field and hides sold homes", () => {
    let rows = [
      card("a", { price: 450000, beds: 2 }),
      card("b", { price: 650000, beds: 4, neighborhood: "Lakeview" }),
      card("c", { price: 700000, beds: 4, status: "sold" }),
      card("d", { price: 900000, beds: 5, propertyType: "condo" }),
      card("e", { price: 620000, beds: 3, status: "pending" }),
    ];

    equal(searchResults(rows, emptyFilters()).map((r) => r.id).sort(), ["a", "b", "d", "e"]);
    equal(searchResults(rows, { ...emptyFilters(), beds: "4" }).map((r) => r.id).sort(), ["b", "d"]);
    equal(searchResults(rows, { ...emptyFilters(), type: "condo" }).map((r) => r.id), ["d"]);
    equal(searchResults(rows, { ...emptyFilters(), hood: "Lakeview" }).map((r) => r.id), ["b"]);
    equal(searchResults(rows, { ...emptyFilters(), minPrice: "600000", maxPrice: "700000" }).map((r) => r.id).sort(), ["b", "e"]);
    equal(searchResults(rows, { ...emptyFilters(), show: "sold" }).map((r) => r.id), ["c"]);
  });

  test("search sorts by newest or price", () => {
    let rows = [
      card("old", { price: 300000, listedAt: new Date("2026-08-01") }),
      card("new", { price: 900000, listedAt: new Date("2026-09-20") }),
      card("mid", { price: 600000, listedAt: new Date("2026-09-01") }),
    ];

    equal(searchResults(rows, emptyFilters()).map((r) => r.id), ["new", "mid", "old"]);
    equal(searchResults(rows, { ...emptyFilters(), sort: "price-asc" }).map((r) => r.id), ["old", "mid", "new"]);
    equal(searchResults(rows, { ...emptyFilters(), sort: "price-desc" }).map((r) => r.id), ["new", "mid", "old"]);
  });

  test("a saved search describes itself", () => {
    let name = describeCriteria(criteriaFromFilters({ ...emptyFilters(), type: "condo", hood: "Harbor Point", maxPrice: "900000", beds: "2" }));

    equal(name, "Condos in Harbor Point, under $900K, 2+ beds");
    equal(describeCriteria(criteriaFromFilters(emptyFilters())), "Homes");
  });

  test("money formats", () => {
    equal(money(1250000), "$1,250,000");
    equal(shortMoney(1250000), "$1.25M");
    equal(shortMoney(450000), "$450K");
    assert(shortMoney(2000000) === "$2M");
  });
});

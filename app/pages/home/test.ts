import { test, equal, assert } from "@elements/app";
import { searchResults } from "#app/shared/services/catalog";
import { toggleFavorite } from "#app/shared/services/favorites";
import { makeUser, makeListing, loginAs } from "#app/shared/testing/fixtures";
import route from "./index";

function open(query: Record<string, string> = {}): any {
  return (route({ params: {}, query } as any, {} as any) as any).attrs;
}

test("search page", () => {
  let agent = makeUser("agent", "Ada Agent");

  /** The view holds the seed listings too; the assertions read this agent's rows. */
  function mine(rows: Iterable<any>): any[] {
    return [...rows].filter((l) => l.agentId === agent.id);
  }

  makeListing(agent.id, { address: "1 Old Town Row", neighborhood: "Old Town", price: 450000 });
  makeListing(agent.id, { address: "2 Lake Road", neighborhood: "Lakeview", price: 950000, beds: 4 });
  makeListing(agent.id, { address: "3 Sold Street", status: "sold" });

  test("opens a live view of every listing with its cover and agent", () => {
    let rows = mine(open().listings);

    equal(rows.length, 3);
    equal(rows[0].agentName, "Ada Agent");
    equal(rows[0].coverAsset, "exterior-01");
  });

  test("reads its filters from the URL", () => {
    let attrs = open({ hood: "Lakeview", beds: "4", sort: "price-desc" });

    equal(attrs.filters.hood, "Lakeview");
    equal(searchResults(mine(attrs.listings), attrs.filters).map((l: any) => l.address), ["2 Lake Road"]);
  });

  test("hides sold homes unless asked", () => {
    let sale = open();
    let sold = open({ show: "sold" });

    equal(searchResults(mine(sale.listings), sale.filters).length, 2);
    equal(searchResults(mine(sold.listings), sold.filters).map((l: any) => l.address), ["3 Sold Street"]);
  });

  test("marks the signed-in buyer's saved homes", () => {
    let buyer = makeUser("buyer");
    let id = makeListing(agent.id);

    equal(open().favs.ids, []);
    loginAs(buyer);
    toggleFavorite(id);
    assert(open().favs.ids.includes(id));
  });
});

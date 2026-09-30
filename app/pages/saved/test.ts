import { test, equal, assert, AuthError } from "@elements/app";
import { saveSearch, toggleFavorite } from "#app/shared/services/favorites";
import { emptyFilters } from "#app/shared/services/catalog";
import { makeUser, makeListing, loginAs } from "#app/shared/testing/fixtures";
import route from "./index";

function open(): any {
  return (route({ params: {}, query: {} } as any, {} as any) as any).attrs;
}

test("saved page", () => {
  test("needs an account", () => {
    let threw: unknown;

    try {
      open();
    } catch (err) {
      threw = err;
    }

    assert(threw instanceof AuthError, `got ${threw}`);
  });

  test("shows my saved homes and searches", () => {
    let agent = makeUser("agent");
    let id = makeListing(agent.id);

    loginAs(makeUser("buyer"));
    toggleFavorite(id);
    saveSearch({ ...emptyFilters(), hood: "Old Town" });

    let attrs = open();

    equal(attrs.favs.ids, [id]);
    equal(attrs.saved.items.map((s: any) => s.name), ["Homes in Old Town"]);
  });
});

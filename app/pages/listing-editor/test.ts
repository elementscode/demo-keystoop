import { test, equal, assert, NotFoundError } from "@elements/app";
import { makeUser, makeListing, loginAs } from "#app/shared/testing/fixtures";
import route from "./index";

function open(id?: string, query: Record<string, string> = {}): any {
  return (route({ params: id ? { id } : {}, query } as any, {} as any) as any).attrs;
}

test("listing editor", () => {
  test("a new listing starts blank", () => {
    loginAs(makeUser("agent"));

    let attrs = open();

    equal(attrs.listingId, "");
    equal(attrs.editor.form.status, "active");
  });

  test("an existing listing loads its fields as text", () => {
    let me = makeUser("agent");
    let id = makeListing(me.id, { address: "5 Editor Way", price: 612000, baths: 2.5 });

    loginAs(me);

    let attrs = open(id, { created: "1" });

    equal(attrs.editor.form.address, "5 Editor Way");
    equal(attrs.editor.form.price, "612000");
    equal(attrs.editor.form.baths, "2.5");
    equal(attrs.panel.photos.length, 1);
    equal(attrs.created, true);
  });

  test("another agent's listing is a 404", () => {
    let id = makeListing(makeUser("agent").id);

    loginAs(makeUser("agent"));

    let threw: unknown;

    try {
      open(id);
    } catch (err) {
      threw = err;
    }

    assert(threw instanceof NotFoundError, `got ${threw}`);
  });
});

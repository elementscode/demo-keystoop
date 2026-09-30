import { test, equal, assert, sql, NotFoundError } from "@elements/app";
import { makeUser, makeListing } from "#app/shared/testing/fixtures";
import route from "./index";

function open(id: string): any {
  return (route({ params: { id }, query: {} } as any, {} as any) as any).attrs;
}

test("listing page", () => {
  let agent = makeUser("agent", "Ada Agent");
  let id = makeListing(agent.id, { address: "12 Gallery Lane" });

  sql(`insert into photos (listingId, position, asset) values (${id}, 1, 'kitchen-1')`);
  sql(`insert into openHouses (listingId, startsAt, endsAt) values (${id}, now() + interval '1 day', now() + interval '1 day 2 hours')`);
  sql(`insert into openHouses (listingId, startsAt, endsAt) values (${id}, now() - interval '2 days', now() - interval '2 days' + interval '2 hours')`);

  test("carries the gallery, the upcoming open houses and the agent", () => {
    let attrs = open(id);

    equal(attrs.listing.address, "12 Gallery Lane");
    equal(attrs.photos.map((p: any) => p.asset), ["exterior-01", "kitchen-1"]);
    equal(attrs.openHouses.length, 1);
    equal(attrs.agent.name, "Ada Agent");
    equal(attrs.inquiry.form.kind, "question");
  });

  test("an unknown or malformed id is a 404", () => {
    for (let bad of ["nope", "01a0f406-0000-7000-8000-000000000000"]) {
      let threw: unknown;

      try {
        open(bad);
      } catch (err) {
        threw = err;
      }

      assert(threw instanceof NotFoundError, `${bad}: got ${threw}`);
    }
  });
});

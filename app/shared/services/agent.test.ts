import { test, equal, assert, sql, File, ValidationError, ForbiddenError, NotFoundError } from "@elements/app";
import {
  createListing,
  updateListing,
  setListingStatus,
  addPhotos,
  makeCover,
  removePhoto,
  addOpenHouse,
  emptyListingForm,
  myListings,
} from "./agent";
import { listings } from "./listings";
import { makeUser, makeListing, loginAs } from "#app/shared/testing/fixtures";

function jpeg(name: string): File {
  let data = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 1, 2, 3, name.length]);

  return new File({ name, size: data.length, contentType: "image/jpeg", data, lastModified: new Date() });
}

function form() {
  return {
    ...emptyListingForm(),
    address: "77 Harbor Lane",
    neighborhood: "Harbor Point",
    propertyType: "condo",
    price: "725,000",
    beds: "2",
    baths: "2.5",
    sqft: "1280",
    photos: [jpeg("front.jpg"), jpeg("kitchen.jpg")],
  };
}

async function thrown(fn: () => unknown): Promise<unknown> {
  try {
    await fn();
  } catch (err) {
    return err;
  }

  return undefined;
}

test("agent listings", async () => {
  test("an agent publishes a listing with photos and it is in search", async () => {
    let agent = makeUser("agent");

    loginAs(agent);

    let { id } = createListing(form());
    let row = sql<{ price: number; baths: number; status: string }>(`select price, baths, status from listings where id = ${id}`).firstOrThrow();

    equal(row.price, 725000);
    equal(row.baths, 2.5);
    equal(row.status, "active");
    equal(sql<{ n: number }>(`select count(*)::int as n from photos where listingId = ${id}`).firstOrThrow().n, 2);

    let card = [...listings.view()].find((l) => l.id === id);

    assert(!!card, "the new listing is in the search view");
    equal(card?.photoCount, 2);
    assert(card?.coverHash !== null, "the cover is an uploaded photo");

    let jobs = sql<{ n: number }>(`select count(*)::int as n from elements.jobs where path like '%notify-saved-searches%'`).firstOrThrow().n;

    assert(jobs >= 1, "publishing queues the saved-search alert");
  });

  test("a buyer cannot publish", async () => {
    loginAs(makeUser("buyer"));
    assert(await thrown(() => createListing(form())) instanceof ForbiddenError);
  });

  test("bad fields come back per field", async () => {
    loginAs(makeUser("agent"));

    let err = await thrown(() => createListing({ ...form(), price: "a lot", baths: "2.3", neighborhood: "Atlantis" }));

    assert(err instanceof ValidationError, `got ${err}`);

    let errors = (err as ValidationError).errors as Record<string, string[]>;

    equal(Object.keys(errors).sort(), ["baths", "neighborhood", "price"]);
  });

  test("a non-image upload is refused", async () => {
    loginAs(makeUser("agent"));

    let html = new File({ name: "x.html", size: 4, contentType: "text/html", data: new Uint8Array([60, 104, 49, 62]), lastModified: new Date() });

    assert(await thrown(() => createListing({ ...form(), photos: [html] })) instanceof ValidationError);
  });

  test("status changes, sold dates, and ownership", async () => {
    let agent = makeUser("agent");
    let id = makeListing(agent.id);

    loginAs(agent);
    setListingStatus(id, "sold");
    equal(sql<{ sold: boolean }>(`select soldAt is not null as sold from listings where id = ${id}`).firstOrThrow().sold, true);

    setListingStatus(id, "active");
    equal(sql<{ sold: boolean }>(`select soldAt is not null as sold from listings where id = ${id}`).firstOrThrow().sold, false);

    loginAs(makeUser("agent"));
    assert(await thrown(() => setListingStatus(id, "pending")) instanceof NotFoundError, "another agent cannot touch it");
    assert(await thrown(() => updateListing(id, form())) instanceof NotFoundError);
    equal(myListings(agent.id).length, 1);
  });

  test("photos: add, reorder the cover, remove", async () => {
    let agent = makeUser("agent");
    let id = makeListing(agent.id);

    loginAs(agent);

    let photos = addPhotos(id, [jpeg("a.jpg"), jpeg("b.jpg")]);

    equal(photos.length, 3);
    equal(photos[0].asset, "exterior-01");

    photos = makeCover(id, photos[2].id);
    equal(photos[0].asset, null);

    photos = removePhoto(id, photos[0].id);
    equal(photos.length, 2);
  });

  test("open houses are stored in the brokerage's time zone", async () => {
    let agent = makeUser("agent");
    let id = makeListing(agent.id);

    loginAs(agent);

    let items = addOpenHouse(id, "2099-06-06", "13:00", "15:00");

    equal(items.length, 1);
    equal(new Date(items[0].startsAt).toISOString(), "2099-06-06T17:00:00.000Z");
    assert(await thrown(() => addOpenHouse(id, "2099-06-06", "15:00", "13:00")) instanceof ValidationError);
  });
});

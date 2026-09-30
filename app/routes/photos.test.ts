import { test, equal, sql } from "@elements/app";
import { makeUser, makeListing } from "#app/shared/testing/fixtures";
import servePhoto from "./photos";

function response() {
  let res: any = { headers: {} as Record<string, string>, code: 200 };

  res.status = (c: number) => { res.code = c; return res; };
  res.setHeader = (k: string, v: string) => { res.headers[k] = v; };
  res.end = () => undefined;

  return res;
}

test("photo route", () => {
  let listingId = makeListing(makeUser("agent").id);
  let photo = sql<{ id: string; hash: string }>(`
    insert into photos (listingId, position, contentType, data)
         values (${listingId}, 1, 'image/jpeg', ${new Uint8Array([1, 2, 3])})
      returning id, hash
  `).firstOrThrow();

  test("serves the bytes with an immutable cache header", () => {
    let res = response();
    let body = servePhoto({ params: { id: photo.id, hash: photo.hash } } as any, res);

    equal(res.code, 200);
    equal(res.headers["Content-Type"], "image/jpeg");
    equal(res.headers["Cache-Control"], "public, max-age=31536000, immutable");
    equal([...(body as Buffer)], [1, 2, 3]);
  });

  test("a stale hash or bad id is a 404", () => {
    let stale = response();
    let bad = response();

    servePhoto({ params: { id: photo.id, hash: "stale" } } as any, stale);
    servePhoto({ params: { id: "x", hash: photo.hash } } as any, bad);

    equal(stale.code, 404);
    equal(bad.code, 404);
  });
});

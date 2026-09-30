import { test, equal, assert, sql, AuthError } from "@elements/app";
import { signup } from "#app/shared/services/auth";
import route from "./index";

test("signup page", () => {
  test("renders with a next path", () => {
    equal((route({ params: {}, query: { next: "/listings/x" } } as any, {} as any) as any).attrs.next, "/listings/x");
  });

  test("refuses a short password before hashing anything", () => {
    let threw: unknown;

    try {
      signup("Jo", "jo@test.dev", "short", "");
    } catch (err) {
      threw = err;
    }

    assert(threw instanceof AuthError, `got ${threw}`);
    equal(sql<{ n: number }>(`select count(*)::int as n from users where email = 'jo@test.dev'`).firstOrThrow().n, 0);
  });
});

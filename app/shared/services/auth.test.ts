import { test, equal, assert, sql, session, AuthError, ForbiddenError } from "@elements/app";
import { signin, requireAgent, safeNext } from "./auth";
import { makeUser, loginAs } from "#app/shared/testing/fixtures";

test("auth", () => {
  test("signin", () => {
    // Cost 4 keeps this the one slow-ish test; the app writes cost 12.
    sql(`
      insert into users (email, passwordHash, name, role)
           values ('nia@test.dev', crypt('correct horse', genSalt('bf', 4)), 'Nia', 'agent')
    `);

    test("the right password logs in", () => {
      try {
        signin("  NIA@test.dev ", "correct horse", "/agent");
      } catch (err) {
        // signin ends in a redirect; the session is what matters here.
      }

      equal(session.get("userName"), "Nia");
      equal(session.get("role"), "agent");
    });

    test("the wrong password is refused without saying which part was wrong", () => {
      let threw: unknown;

      try {
        signin("nia@test.dev", "wrong", "");
      } catch (err) {
        threw = err;
      }

      assert(threw instanceof AuthError, `got ${threw}`);
      equal((threw as AuthError).message, "That email and password do not match.");
      assert(!session.isLoggedIn());
    });
  });

  test("requireAgent refuses a buyer and a visitor", () => {
    let visitor: unknown;

    try {
      requireAgent();
    } catch (err) {
      visitor = err;
    }

    assert(visitor instanceof AuthError, `got ${visitor}`);

    loginAs(makeUser("buyer"));

    let buyer: unknown;

    try {
      requireAgent();
    } catch (err) {
      buyer = err;
    }

    assert(buyer instanceof ForbiddenError, `got ${buyer}`);

    let agent = makeUser("agent");

    loginAs(agent);
    equal(requireAgent(), agent.id);
  });

  test("safeNext only allows same-site paths", () => {
    equal(safeNext("/saved", "/"), "/saved");
    equal(safeNext("//evil.example", "/"), "/");
    equal(safeNext("https://evil.example", "/"), "/");
    equal(safeNext(undefined, "/agent"), "/agent");
  });
});

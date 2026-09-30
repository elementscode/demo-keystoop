import { test, equal, assert, AuthError } from "@elements/app";
import { sendInquiry } from "#app/shared/services/inquiries";
import { makeUser, makeListing, loginAs } from "#app/shared/testing/fixtures";
import route from "./index";

function open(): any {
  return (route({ params: {}, query: {} } as any, {} as any) as any).attrs;
}

test("inquiries inbox", () => {
  test("needs a signed-in agent", () => {
    let threw: unknown;

    try {
      open();
    } catch (err) {
      threw = err;
    }

    assert(threw instanceof AuthError, `got ${threw}`);
  });

  test("opens the agent's partition of inquiries", () => {
    let me = makeUser("agent");
    let id = makeListing(me.id, { address: "8 Inbox Road" });

    sendInquiry({ listingId: id, kind: "showing", name: "Sam", email: "sam@example.com", phone: "", message: "", preferredTime: "Sunday" });
    loginAs(me);

    let rows = [...open().inbox];

    equal(rows.length, 1);
    equal(rows[0].listingAddress, "8 Inbox Road");
    equal(rows[0].preferredTime, "Sunday");
  });
});

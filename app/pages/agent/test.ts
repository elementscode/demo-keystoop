import { test, equal, assert, ForbiddenError } from "@elements/app";
import { sendInquiry } from "#app/shared/services/inquiries";
import { makeUser, makeListing, loginAs } from "#app/shared/testing/fixtures";
import route from "./index";

function open(): any {
  return (route({ params: {}, query: {} } as any, {} as any) as any).attrs;
}

test("agent desk", () => {
  test("is for agents only", () => {
    loginAs(makeUser("buyer"));

    let threw: unknown;

    try {
      open();
    } catch (err) {
      threw = err;
    }

    assert(threw instanceof ForbiddenError, `got ${threw}`);
  });

  test("lists my listings and my inquiries, not another agent's", () => {
    let me = makeUser("agent", "Nora Agent");
    let other = makeUser("agent");
    let mine = makeListing(me.id, { address: "1 Mine Street", status: "pending" });

    makeListing(other.id, { address: "2 Theirs Street" });
    sendInquiry({ listingId: mine, kind: "question", name: "Dana", email: "dana@example.com", phone: "", message: "Hi", preferredTime: "" });

    loginAs(me);

    let attrs = open();

    equal(attrs.agentName, "Nora Agent");
    equal(attrs.rows.map((r: any) => r.listing.address), ["1 Mine Street"]);
    equal(attrs.rows[0].listing.inquiryCount, 1);
    equal([...attrs.inbox].length, 1);
  });
});

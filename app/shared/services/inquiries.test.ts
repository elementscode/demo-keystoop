import { test, equal, assert, sql, ValidationError, NotFoundError } from "@elements/app";
import { sendInquiry, markInquiryRead, unreadCount, inquiries } from "./inquiries";
import { makeUser, makeListing, loginAs } from "#app/shared/testing/fixtures";

test("inquiries", () => {
  let agent = makeUser("agent", "Nora Test");
  let listingId = makeListing(agent.id, { address: "9 Elm Street" });

  let form = {
    listingId,
    kind: "showing" as const,
    name: "Dana",
    email: "Dana@Example.com",
    phone: "",
    message: "",
    preferredTime: "Saturday",
  };

  test("a showing request reaches the listing agent and queues the email", () => {
    let result = sendInquiry(form);

    equal(result.agentName, "Nora Test");

    let row = sql<{ agentId: string; email: string; kind: string }>(`
      select agentId, email, kind from inquiries where listingId = ${listingId}
    `).firstOrThrow();

    equal(row.agentId, agent.id);
    equal(row.email, "dana@example.com");
    equal(row.kind, "showing");
    equal(unreadCount(agent.id), 1);

    let jobs = sql<{ n: number }>(`
      select count(*)::int as n from elements.jobs where path like '%send-inquiry%'
    `).firstOrThrow().n;

    assert(jobs >= 1, `expected a queued SendInquiryJob, found ${jobs}`);
  });

  test("a question needs a name, an email and a question", () => {
    let threw: unknown;

    try {
      sendInquiry({ ...form, kind: "question", name: " ", email: "nope", message: "" });
    } catch (err) {
      threw = err;
    }

    assert(threw instanceof ValidationError, `got ${threw}`);

    let errors = (threw as ValidationError).errors as Record<string, string[]>;

    assert(!!errors.name && !!errors.email && !!errors.message, `got ${JSON.stringify(errors)}`);
  });

  test("the inbox view holds only the agent's own inquiries", () => {
    let other = makeUser("agent");
    let otherListing = makeListing(other.id);

    sendInquiry(form);
    sendInquiry({ ...form, listingId: otherListing });

    let rows = [...inquiries.view({ agentId: agent.id })];

    equal(rows.length, 1);
    equal(rows[0].listingAddress, "9 Elm Street");
  });

  test("only the listing agent can mark an inquiry read", () => {
    sendInquiry(form);

    let id = sql<{ id: string }>(`select id from inquiries where listingId = ${listingId}`).firstOrThrow().id;

    loginAs(makeUser("agent"));
    markInquiryRead(id, true);
    equal(unreadCount(agent.id), 1);

    loginAs(agent);
    markInquiryRead(id, true);
    equal(unreadCount(agent.id), 0);
  });

  test("an unknown listing is refused", () => {
    let threw: unknown;

    try {
      sendInquiry({ ...form, listingId: "01a0f406-0000-7000-8000-000000000000" });
    } catch (err) {
      threw = err;
    }

    assert(threw instanceof NotFoundError, `got ${threw}`);
  });
});

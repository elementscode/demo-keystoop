import { test, equal, sql } from "@elements/app";
import { NotifySavedSearchesJob } from "./notify-saved-searches";
import { SendInquiryJob } from "./send-inquiry";
import { claimMatches } from "#app/shared/services/alerts";
import { saveSearch } from "#app/shared/services/favorites";
import { sendInquiry } from "#app/shared/services/inquiries";
import { emptyFilters } from "#app/shared/services/catalog";
import { makeUser, makeListing, loginAs } from "#app/shared/testing/fixtures";

test("jobs", () => {
  test("a new listing matches each saved search once", () => {
    let agent = makeUser("agent");
    let buyer = makeUser("buyer");

    loginAs(buyer);
    saveSearch({ ...emptyFilters(), hood: "Harbor Point", maxPrice: "800000" });
    saveSearch({ ...emptyFilters(), hood: "Old Town" });
    saveSearch({ ...emptyFilters(), beds: "2", type: "condo" });

    let condo = makeListing(agent.id, { neighborhood: "Harbor Point", propertyType: "condo", price: 700000, beds: 2 });
    let first = claimMatches(condo);
    let mine = first.filter((m) => m.userEmail === buyer.email);

    equal(mine.map((m) => m.searchName).sort(), ["Condos, 2+ beds", "Homes in Harbor Point, under $800K"]);
    equal(mine.length, 2);
    equal(claimMatches(condo), []);
  });

  test("a pending listing is not announced", () => {
    let agent = makeUser("agent");

    loginAs(makeUser("buyer"));
    saveSearch(emptyFilters());

    equal(claimMatches(makeListing(agent.id, { status: "pending" })), []);
  });

  test("the alert job runs and records what it sent", () => {
    let agent = makeUser("agent");

    loginAs(makeUser("buyer"));
    saveSearch({ ...emptyFilters(), hood: "Lakeview" });

    let id = makeListing(agent.id, { neighborhood: "Lakeview" });

    new NotifySavedSearchesJob({ listingId: id }).run();

    equal(sql<{ n: number }>(`select count(*)::int as n from savedSearchMatches where listingId = ${id}`).firstOrThrow().n, 1);
  });

  test("the inquiry job emails the agent", () => {
    let agent = makeUser("agent");
    let id = makeListing(agent.id);

    sendInquiry({ listingId: id, kind: "question", name: "Dana", email: "dana@example.com", phone: "", message: "Taxes?", preferredTime: "" });

    let inquiryId = sql<{ id: string }>(`select id from inquiries where listingId = ${id}`).firstOrThrow().id;

    new SendInquiryJob({ inquiryId }).run();
  });
});

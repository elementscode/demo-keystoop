import { test, equal } from "@elements/app";
import { DEMO_AGENTS } from "#app/shared/services/auth";
import route from "./index";

test("signin page", () => {
  test("keeps a same-site next and drops an offsite one", () => {
    equal((route({ params: {}, query: { next: "/saved" } } as any, {} as any) as any).attrs.next, "/saved");
    equal((route({ params: {}, query: { next: "https://evil.example" } } as any, {} as any) as any).attrs.next, "");
  });

  test("lists the three demo agents", () => {
    equal(DEMO_AGENTS.length, 3);
  });
});

import { sql, session } from "@elements/app";

export interface TestUser {
  id: string;
  name: string;
  email: string;
  role: "buyer" | "agent";
}

/** A user with a placeholder hash: tests sign in through the session, not bcrypt. */
export function makeUser(role: "buyer" | "agent", name = role === "agent" ? "Ada Agent" : "Bo Buyer"): TestUser {
  return sql<TestUser>(`
    insert into users (email, passwordHash, name, role)
         values (${`${role}.${crypto.randomUUID().slice(0, 8)}@test.dev`}, 'x', ${name}, ${role})
      returning id, name, email, role
  `).firstOrThrow();
}

export function loginAs(user: TestUser) {
  session.login({ userId: user.id, userName: user.name, email: user.email, role: user.role });
}

export interface ListingSeed {
  status?: "active" | "pending" | "sold";
  address?: string;
  neighborhood?: string;
  propertyType?: string;
  price?: number;
  beds?: number;
  baths?: number;
  sqft?: number;
}

export function makeListing(agentId: string, seed: ListingSeed = {}): string {
  let row = sql<{ id: string }>(`
    insert into listings (agentId, status, address, neighborhood, propertyType, price, beds, baths, sqft)
         values (${agentId},
                 ${seed.status ?? "active"},
                 ${seed.address ?? "1 Test Street"},
                 ${seed.neighborhood ?? "Old Town"},
                 ${seed.propertyType ?? "house"},
                 ${seed.price ?? 500000},
                 ${seed.beds ?? 3},
                 ${seed.baths ?? 2},
                 ${seed.sqft ?? 1500})
      returning id
  `).firstOrThrow();

  sql(`insert into photos (listingId, position, asset) values (${row.id}, 0, 'exterior-01')`);

  return row.id;
}

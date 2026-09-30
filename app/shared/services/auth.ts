import { sql, session, redirect, AuthError, ForbiddenError, SqlError } from "@elements/app";

interface User {
  id: string;
  email: string;
  name: string;
  role: "buyer" | "agent";
}

export const MIN_PASSWORD = 8;

/** The agent accounts the seed creates, shown on the sign-in page. */
export const DEMO_AGENTS = [
  { name: "Nora Whitfield", email: "nora@keystoop.test" },
  { name: "Marcus Bell", email: "marcus@keystoop.test" },
  { name: "Maya Torres", email: "maya@keystoop.test" },
];

/** A buyer the seed creates, with saved homes and saved searches. */
export const DEMO_BUYER = { name: "Sam Rivera", email: "sam.rivera@example.com" };

export const DEMO_PASSWORD = "keystoop";

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function isEmail(email: string): boolean {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
}

/** Only a same-site path, so a crafted link cannot bounce a login offsite. */
export function safeNext(next: string | undefined, fallback: string): string {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : fallback;
}

function login(user: User) {
  session.login({ userId: user.id, userName: user.name, email: user.email, role: user.role });
}

/** @rpc */
export function signin(email: string, password: string, next: string) {
  let address = normalizeEmail(email);

  if (!address || !password) {
    throw new AuthError("Enter your email and password.");
  }

  let user = sql<User>(`
    select id, email, name, role from users
     where email = ${address}
       and passwordHash = crypt(${password}, passwordHash)
  `).first();

  if (!user) {
    throw new AuthError("That email and password do not match.");
  }

  login(user);
  redirect(safeNext(next, user.role === "agent" ? "/agent" : "/"));
}

/** @rpc */
export function signup(name: string, email: string, password: string, next: string) {
  let address = normalizeEmail(email);
  let display = name.trim();

  if (!display) {
    throw new AuthError("Enter your name.");
  }

  if (!isEmail(address)) {
    throw new AuthError("Enter a valid email address.");
  }

  if (password.length < MIN_PASSWORD) {
    throw new AuthError(`Your password needs at least ${MIN_PASSWORD} characters.`);
  }

  if (!sql(`select 1 from users where email = ${address}`).empty()) {
    throw new AuthError("That email already has an account. Sign in instead.");
  }

  let user: User;

  try {
    user = sql<User>(`
      insert into users (email, passwordHash, name)
           values (${address}, crypt(${password}, genSalt('bf', 12)), ${display})
        returning id, email, name, role
    `).firstOrThrow();
  } catch (err) {
    if (err instanceof SqlError) {
      throw new AuthError("That email already has an account. Sign in instead.");
    }

    throw err;
  }

  login(user);
  redirect(safeNext(next, "/"));
}

/** @rpc */
export function signout() {
  session.logout();
  redirect("/");
}

/** The signed-in agent's id, or a 401/403. Routes and rpc both call it. */
export function requireAgent(): string {
  session.isLoggedInOrThrow();

  let userId = session.getOrThrow("userId");

  if (sql(`select 1 from users where id = ${userId} and role = 'agent'`).empty()) {
    throw new ForbiddenError("Agent access only.");
  }

  return userId;
}

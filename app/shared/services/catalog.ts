/**
 * The listing vocabulary shared by the browser and the server: the types a
 * page renders, the search filters, and how both are formatted.
 */

export type ListingStatus = "active" | "pending" | "sold";

export type PropertyType = "house" | "condo" | "townhouse";

export const NEIGHBORHOODS = [
  "Bellmont Hills",
  "Cedar Park",
  "Harbor Point",
  "Lakeview",
  "Maple Heights",
  "Old Town",
  "Riverside",
  "West End",
];

export const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
  { value: "house", label: "House" },
  { value: "condo", label: "Condo" },
  { value: "townhouse", label: "Townhouse" },
];

export const STATUSES: { value: ListingStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "pending", label: "Pending" },
  { value: "sold", label: "Sold" },
];

export const PRICE_STEPS = [
  250000, 300000, 400000, 500000, 600000, 700000, 800000, 1000000, 1250000, 1500000, 2000000, 2500000,
];

/** The brokerage is local, so every time on the site is local to it. */
export const TIME_ZONE = "America/New_York";

/** One row of search results: a listing with its cover photo and agent. */
export interface ListingCard {
  id: string;
  status: ListingStatus;
  address: string;
  neighborhood: string;
  propertyType: PropertyType;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  headline: string;
  listedAt: Date;
  agentId: string;
  agentName: string;
  coverId: string | null;
  coverAsset: string | null;
  coverHash: string | null;
  photoCount: number;
  nextOpenHouse: Date | null;
}

/**
 * The search form. Every field is the string its select holds, "" meaning
 * any, so the form binds straight to it and the URL round-trips it.
 */
export interface Filters {
  minPrice: string;
  maxPrice: string;
  beds: string;
  baths: string;
  type: string;
  hood: string;
  show: "sale" | "sold";
  sort: "newest" | "price-asc" | "price-desc";
}

/** A saved search: the filters that matter for a new-listing alert. */
export interface Criteria {
  minPrice: number | null;
  maxPrice: number | null;
  minBeds: number | null;
  minBaths: number | null;
  propertyType: string | null;
  neighborhood: string | null;
}

export function emptyFilters(): Filters {
  return {
    minPrice: "",
    maxPrice: "",
    beds: "",
    baths: "",
    type: "",
    hood: "",
    show: "sale",
    sort: "newest",
  };
}

function one(v: string | string[] | undefined): string {
  return (Array.isArray(v) ? v[0] : v) ?? "";
}

function inList(v: string, list: string[]): string {
  return list.includes(v) ? v : "";
}

export function filtersFromQuery(query: Record<string, string | string[] | undefined>): Filters {
  let f = emptyFilters();
  let digits = (v: string) => (/^\d+(\.\d+)?$/.test(v) ? v : "");

  f.minPrice = digits(one(query.minPrice));
  f.maxPrice = digits(one(query.maxPrice));
  f.beds = digits(one(query.beds));
  f.baths = digits(one(query.baths));
  f.type = inList(one(query.type), PROPERTY_TYPES.map((t) => t.value));
  f.hood = inList(one(query.hood), NEIGHBORHOODS);
  f.show = one(query.show) === "sold" ? "sold" : "sale";

  let sort = one(query.sort);
  f.sort = sort === "price-asc" || sort === "price-desc" ? sort : "newest";

  return f;
}

export function filtersToQuery(f: Filters): string {
  let params: string[] = [];
  let add = (key: string, value: string) => {
    if (value) {
      params.push(`${key}=${encodeURIComponent(value)}`);
    }
  };

  add("minPrice", f.minPrice);
  add("maxPrice", f.maxPrice);
  add("beds", f.beds);
  add("baths", f.baths);
  add("type", f.type);
  add("hood", f.hood);
  add("show", f.show === "sold" ? "sold" : "");
  add("sort", f.sort === "newest" ? "" : f.sort);

  return params.length ? `?${params.join("&")}` : "";
}

function num(v: string): number | null {
  return v === "" ? null : Number(v);
}

export function criteriaFromFilters(f: Filters): Criteria {
  return {
    minPrice: num(f.minPrice),
    maxPrice: num(f.maxPrice),
    minBeds: num(f.beds),
    minBaths: num(f.baths),
    propertyType: f.type || null,
    neighborhood: f.hood || null,
  };
}

export function filtersFromCriteria(c: Criteria): Filters {
  let str = (v: number | null) => (v === null ? "" : String(v));

  return {
    ...emptyFilters(),
    minPrice: str(c.minPrice),
    maxPrice: str(c.maxPrice),
    beds: str(c.minBeds),
    baths: str(c.minBaths),
    type: c.propertyType ?? "",
    hood: c.neighborhood ?? "",
  };
}

/** Whether a listing meets a saved search, ignoring status. */
export function meetsCriteria(l: ListingCard | Omit<ListingCard, "agentName">, c: Criteria): boolean {
  return (
    (c.minPrice === null || l.price >= c.minPrice) &&
    (c.maxPrice === null || l.price <= c.maxPrice) &&
    (c.minBeds === null || l.beds >= c.minBeds) &&
    (c.minBaths === null || l.baths >= c.minBaths) &&
    (c.propertyType === null || l.propertyType === c.propertyType) &&
    (c.neighborhood === null || l.neighborhood === c.neighborhood)
  );
}

/** The search results for a set of filters, in the order they ask for. */
export function searchResults(rows: Iterable<ListingCard>, f: Filters): ListingCard[] {
  let c = criteriaFromFilters(f);
  let out: ListingCard[] = [];

  for (let l of rows) {
    let shown = f.show === "sold" ? l.status === "sold" : l.status !== "sold";

    if (shown && meetsCriteria(l, c)) {
      out.push(l);
    }
  }

  switch (f.sort) {
    case "price-asc":
      return out.sort((a, b) => a.price - b.price);

    case "price-desc":
      return out.sort((a, b) => b.price - a.price);

    default:
      return out.sort((a, b) => +new Date(b.listedAt) - +new Date(a.listedAt));
  }
}

export function describeCriteria(c: Criteria): string {
  let parts: string[] = [];

  if (c.propertyType) {
    parts.push(typeLabel(c.propertyType) + "s");
  } else {
    parts.push("Homes");
  }

  if (c.neighborhood) {
    parts.push(`in ${c.neighborhood}`);
  }

  if (c.minPrice !== null && c.maxPrice !== null) {
    parts.push(`${shortMoney(c.minPrice)} to ${shortMoney(c.maxPrice)}`);
  } else if (c.minPrice !== null) {
    parts.push(`over ${shortMoney(c.minPrice)}`);
  } else if (c.maxPrice !== null) {
    parts.push(`under ${shortMoney(c.maxPrice)}`);
  }

  if (c.minBeds !== null) {
    parts.push(`${c.minBeds}+ beds`);
  }

  if (c.minBaths !== null) {
    parts.push(`${c.minBaths}+ baths`);
  }

  return parts.join(", ").replace(/^(\w+), in/, "$1 in");
}

export function money(n: number): string {
  return "$" + Math.round(n).toLocaleString("en-US");
}

export function shortMoney(n: number): string {
  if (n >= 1000000) {
    return `$${+(n / 1000000).toFixed(2)}M`;
  }

  return `$${Math.round(n / 1000)}K`;
}

export function typeLabel(t: string): string {
  return PROPERTY_TYPES.find((p) => p.value === t)?.label ?? t;
}

export function statusLabel(s: string): string {
  return STATUSES.find((p) => p.value === s)?.label ?? s;
}

export function bathsLabel(n: number): string {
  return `${+n.toFixed(1)} ${n === 1 ? "bath" : "baths"}`;
}

export function bedsLabel(n: number): string {
  if (n === 0) {
    return "Studio";
  }

  return `${n} ${n === 1 ? "bed" : "beds"}`;
}

export function sqftLabel(n: number): string {
  return `${n.toLocaleString("en-US")} sq ft`;
}

export function isNew(l: { listedAt: Date; status: string }): boolean {
  return l.status === "active" && Date.now() - +new Date(l.listedAt) < 3 * 86400000;
}

export function dateLabel(d: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    month: "short",
    day: "numeric",
  }).format(new Date(d));
}

export function dayLabel(d: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date(d));
}

export function shortDayLabel(d: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date(d));
}

export function timeLabel(d: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(d));
}

export function timeAgo(d: Date): string {
  let s = Math.max(0, (Date.now() - +new Date(d)) / 1000);

  if (s < 60) {
    return "just now";
  }

  if (s < 3600) {
    return `${Math.floor(s / 60)}m ago`;
  }

  if (s < 86400) {
    return `${Math.floor(s / 3600)}h ago`;
  }

  if (s < 7 * 86400) {
    return `${Math.floor(s / 86400)}d ago`;
  }

  return dateLabel(d);
}

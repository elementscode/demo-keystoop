import { LiveTable, ForbiddenError, ValidationError, sql, session, tx } from "@elements/app";
import { SendInquiryJob } from "#app/jobs/send-inquiry";
import { requireAgent } from "#app/shared/services/auth";

export type InquiryKind = "question" | "showing";

export interface InquiryForm {
  listingId: string;
  kind: InquiryKind;
  name: string;
  email: string;
  phone: string;
  message: string;
  preferredTime: string;
}

export interface Inquiry {
  id: string;
  agentId: string;
  listingId: string;
  listingAddress: string;
  kind: InquiryKind;
  name: string;
  email: string;
  phone: string;
  message: string;
  preferredTime: string;
  readAt: Date | null;
  createdAt: Date;
}

/**
 * An agent's inbox. The inquiries trigger broadcasts every write on the
 * agent's partition, so a question sent from a listing page lands in the
 * open inbox without anyone writing through the view.
 */
export let inquiries: LiveTable<Inquiry> = new LiveTable<Inquiry>({
  table: "inquiries",
  channel: (partition) => (partition ? `inquiries:${partition}` : "inquiries"),

  select: ({ agentId }, w) => sql<Inquiry>(`
    select i.id,
           i.agentId,
           i.listingId,
           l.address as listingAddress,
           i.kind,
           i.name,
           i.email,
           i.phone,
           i.message,
           i.preferredTime,
           i.readAt,
           i.createdAt
      from inquiries i
      join listings l on l.id = i.listingId
     where i.agentId = ${agentId} and ${w.keyset("i")}
     order by ${w.order("i")} ${w.page()}
  `),

  insert: () => {
    throw new ForbiddenError();
  },

  update: () => {
    throw new ForbiddenError();
  },

  delete: () => {
    throw new ForbiddenError();
  },
});

function isEmail(email: string): boolean {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
}

/** @rpc */
export function sendInquiry(form: InquiryForm): { agentName: string } {
  let errors: Partial<Record<keyof InquiryForm, string[]>> = {};
  let name = form.name.trim();
  let address = form.email.trim().toLowerCase();

  if (!name) {
    errors.name = ["Enter your name."];
  }

  if (!isEmail(address)) {
    errors.email = ["Enter an email the agent can reply to."];
  }

  if (form.kind === "question" && !form.message.trim()) {
    errors.message = ["Write your question."];
  }

  if (Object.keys(errors).length > 0) {
    throw new ValidationError(errors);
  }

  let listing = sql<{ id: string; agentId: string; agentName: string }>(`
    select l.id, l.agentId, u.name as agentName
      from listings l join users u on u.id = l.agentId
     where l.id = ${form.listingId}
  `).firstOrThrow("That listing is no longer available.");

  let kind: InquiryKind = form.kind === "showing" ? "showing" : "question";

  tx(() => {
    let row = sql<{ id: string }>(`
      insert into inquiries (listingId, agentId, kind, name, email, phone, message, preferredTime)
           values (${listing.id},
                   ${listing.agentId},
                   ${kind},
                   ${name},
                   ${address},
                   ${form.phone.trim()},
                   ${form.message.trim()},
                   ${form.preferredTime.trim()})
        returning id
    `).firstOrThrow();

    new SendInquiryJob({ inquiryId: row.id }).schedule();
  });

  return { agentName: listing.agentName };
}

/** @rpc */
export function markInquiryRead(id: string, read: boolean) {
  let agentId = requireAgent();

  sql(`
    update inquiries
       set readAt = ${read ? new Date() : null}
     where id = ${id} and agentId = ${agentId}
  `);
}

export function unreadCount(agentId: string): number {
  return sql<{ n: number }>(`
    select count(*)::int as n from inquiries where agentId = ${agentId} and readAt is null
  `).firstOrThrow().n;
}

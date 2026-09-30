import { Job, email, sql } from "@elements/app";
import InquiryReceivedEmail, { InquiryDetails } from "#app/emails/inquiry-received";

export class SendInquiryJob extends Job<{ inquiryId: string }> {
  static maxAttempts = 5;

  run() {
    let inquiry = sql<InquiryDetails & { agentEmail: string }>(`
      select i.kind,
             i.name,
             i.email,
             i.phone,
             i.message,
             i.preferredTime,
             l.id as listingId,
             l.address as listingAddress,
             l.price as listingPrice,
             u.name as agentName,
             u.email as agentEmail
        from inquiries i
        join listings l on l.id = i.listingId
        join users u on u.id = i.agentId
       where i.id = ${this.fields.inquiryId}
    `).first();

    if (!inquiry) {
      return;
    }

    let what = inquiry.kind === "showing" ? "Showing request" : "Question";

    email({
      to: inquiry.agentEmail,
      replyTo: inquiry.email,
      subject: `${what} from ${inquiry.name}: ${inquiry.listingAddress}`,
      body: new InquiryReceivedEmail({ inquiry }),
    });
  }
}

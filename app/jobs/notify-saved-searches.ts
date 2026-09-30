import { Job, email, sql, tx } from "@elements/app";
import NewMatchesEmail, { MatchedListing } from "#app/emails/new-matches";
import { claimMatches } from "#app/shared/services/alerts";

/** Emails everyone whose saved search a newly active listing meets. */
export class NotifySavedSearchesJob extends Job<{ listingId: string }> {
  static maxAttempts = 3;

  run() {
    let listing = sql<MatchedListing>(`
      select l.id, l.address, l.neighborhood, l.price, l.beds, l.baths, l.sqft, l.headline,
             c.id as coverId, c.asset as coverAsset, c.hash as coverHash
        from listings l
        left join lateral (
          select id, asset, hash from photos where listingId = l.id order by position, createdAt limit 1
        ) c on true
       where l.id = ${this.fields.listingId}
    `).first();

    if (!listing) {
      return;
    }

    let matches = tx(() => claimMatches(listing!.id));

    for (let m of matches) {
      email({
        to: m.userEmail,
        subject: `New match for "${m.searchName}": ${listing.address}`,
        body: new NewMatchesEmail({ listing, userName: m.userName, searchName: m.searchName }),
      });
    }
  }
}

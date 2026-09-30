import { Request, Response, session } from "@elements/app";
import { favoriteIds, savedSearches } from "#app/shared/services/favorites";
import { listings } from "#app/shared/services/listings";
import html from "./template";

export default function route(req: Request, res: Response) {
  session.isLoggedInOrThrow();

  return new html({
    listings: listings.view(),
    favoriteIds: favoriteIds(),
    searches: savedSearches(),
  });
}

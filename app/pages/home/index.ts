import { Request, Response } from "@elements/app";
import { filtersFromQuery } from "#app/shared/services/catalog";
import { favoriteIds } from "#app/shared/services/favorites";
import { listings } from "#app/shared/services/listings";
import html from "./template";

export default function route(req: Request, res: Response) {
  return new html({
    listings: listings.view(),
    initial: filtersFromQuery(req.query),
    favoriteIds: favoriteIds(),
  });
}

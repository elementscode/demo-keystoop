import { Request, Response, sql } from "@elements/app";

interface PhotoBytes {
  contentType: string;
  hash: string;
  data: Buffer;
}

// Types we are willing to render on our own origin.
const INLINE = new Set(["image/png", "image/jpeg", "image/gif", "image/webp"]);

const YEAR = 31536000;

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Uploaded listing photos. The hash in the URL makes them safe to cache forever. */
export default function servePhoto(req: Request, res: Response) {
  let photo = UUID.test(req.params.id)
    ? sql<PhotoBytes>(`
        select contentType, hash, data from photos where id = ${req.params.id} and data is not null
      `).first()
    : undefined;

  if (!photo || photo.hash !== req.params.hash) {
    res.status(404);
    return res.end();
  }

  if (INLINE.has(photo.contentType)) {
    res.setHeader("Content-Type", photo.contentType);
  } else {
    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader("Content-Disposition", "attachment");
  }

  res.setHeader("Cache-Control", `public, max-age=${YEAR}, immutable`);

  return photo.data;
}

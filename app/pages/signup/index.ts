import { Request, Response, redirect, session } from "@elements/app";
import { safeNext } from "#app/shared/services/auth";
import signup from "./template";

export default function route(req: Request, res: Response) {
  let next = safeNext(String(req.query.next ?? ""), "");

  if (session.isLoggedIn()) {
    redirect(next || "/");
    return;
  }

  return new signup({ next });
}

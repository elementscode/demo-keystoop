import { Request, Response } from "@elements/app";
import { requireAgent } from "#app/shared/services/auth";
import { inquiries } from "#app/shared/services/inquiries";
import html from "./template";

export default function route(req: Request, res: Response) {
  let agentId = requireAgent();

  return new html({ inbox: inquiries.view({ agentId }) });
}

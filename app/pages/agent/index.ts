import { Request, Response, session } from "@elements/app";
import { requireAgent } from "#app/shared/services/auth";
import { myListings } from "#app/shared/services/agent";
import { inquiries } from "#app/shared/services/inquiries";
import html from "./template";

export default function route(req: Request, res: Response) {
  let agentId = requireAgent();

  return new html({
    agentName: session.getOrThrow("userName"),
    initial: myListings(agentId),
    inbox: inquiries.view({ agentId }),
  });
}

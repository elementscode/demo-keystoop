import { App, redirect } from "@elements/app";
import config from "#config";
import home from "#app/pages/home";
import listing from "#app/pages/listing";
import signin from "#app/pages/signin";
import signup from "#app/pages/signup";
import saved from "#app/pages/saved";
import agent from "#app/pages/agent";
import listingEditor from "#app/pages/listing-editor";
import inquiries from "#app/pages/inquiries";
import servePhoto from "#app/routes/photos";
import notFound from "#app/pages/errors/not-found";
import unhandled from "#app/pages/errors/unhandled";

const app = new App();

app.route("/", home);
app.route("/listings/:id", listing);
app.route("/signin", signin);
app.route("/signup", signup);
app.route("/saved", saved);
app.route("/agent", agent);
app.route("/agent/listings/new", listingEditor);
app.route("/agent/listings/:id", listingEditor);
app.route("/agent/inquiries", inquiries);
app.route("/photos/:id/:hash", servePhoto);

app.error((req, res, err) => {
  switch (err.statusCode) {
    case 401:
      redirect(`/signin?next=${encodeURIComponent(req.url ?? "/")}`);
      return;

    case 403:
    case 404:
      return notFound(req, res, err);

    default:
      return unhandled(req, res, err);
  }
});

app.start(config);

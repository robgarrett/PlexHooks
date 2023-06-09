import express from "express";
import multer from "multer";
import compression from "compression";
import home from "./home.js";
import webhook from "./webhook.js";
import Database from "./db.js";
import path from "path";
import { fileURLToPath } from "url";

// eslint-disable-next-line no-underscore-dangle
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const port = 8080;
const app = express();

// In memory parsing of multi-form data.
const upload = multer();

// Parsers.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

// Serve static files from the dist folder.
app.use(express.static(__dirname));

// Handlers.
app.get("/", home);
app.post("/", upload.single("thumb"), webhook);

app.listen(port, err => {
    console.log("Listening on port " + port);
    // Provision DB.
    const db = Database.instance;
    db.asyncCount({}).then(count => console.log(`Loaded database with ${count} existing rows`));
    if (err) {
        console.log(err);
    }
});

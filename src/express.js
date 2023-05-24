/*
 *Used for production build, the dev build used webpack-dev-server.
 */
import express from "express";
import multer from "multer";
import compression from "compression";
import home from "./home";
import webhook from "./webhook";

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
    if (err) {
        console.log(err);
    }
});

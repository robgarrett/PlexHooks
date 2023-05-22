/*
 *Used for production build, the dev build used webpack-dev-server.
 */
import express from "express";
import home from "./home.js";
import webhook from "./webhook.js";
import multer from "multer";

const port = 8080;
const app = express();

// In memory parsing of multi-form data.
const upload = multer();

// Use compression in production.
app.use(require("compression")());

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

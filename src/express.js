/*
 *Used for production build, the dev build used webpack-dev-server.
 */
import express from "express";
import home from "./home";

const port = 8080;
const app = express();

// Use compression in production.
app.use(require("compression")());

// Serve static files from the dist folder.
app.use(express.static(__dirname));

// Root entry.
app.get("/", home);

app.listen(port, err => {
    console.log("Listening on port " + port);
    if (err) {
        console.log(err);
    }
});

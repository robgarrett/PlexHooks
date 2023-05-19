/*
 *Used for production build, the dev build used webpack-dev-server.
 */
import express from "express";
import home from "./home";
import webhook from "./webhook";
const port = 8080;
const app = express();

// Parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// Parse application/json
app.use(express.json());

// Use compression in production.
app.use(require("compression")());

// Serve static files from the dist folder.
app.use(express.static(__dirname));

// Handlers.
app.get("/", home);
app.post("/", webhook);

app.listen(port, err => {
    console.log("Listening on port " + port);
    if (err) {
        console.log(err);
    }
});

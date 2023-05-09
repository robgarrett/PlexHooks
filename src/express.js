import express from "express";
import index from "./index";

const port = 8080;
const app = express();

// Use compression in production.
app.use(require("compression")());

// Serve static files from the dist folder.
app.use(express.static(__dirname));

// Root entry.
app.get("/", index);

app.listen(port, err => {
    console.log("Listening on port " + port);
    if (err) {
        console.log(err);
    }
});

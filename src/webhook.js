import Datastore from "nedb";
import path from "path";

export default (req, res) => {
    if (typeof req.body === "undefined" || typeof req.body.payload === "undefined") {
        console.error("Expecting a body with a payload");
        res.sendStatus(500);
    } else {
        try {
            const payload = JSON.parse(req.body.payload);
            const db = new Datastore({
                filename: path.join(__dirname, "datastore.dat"),
                autoload: true
            });
            console.log("Got webhook for", payload.event);
            if (payload.event === "media.scrobble") {
                console.log(JSON.stringify(payload.Metadata));
            }
            res.sendStatus(200);
        } catch (err) {
            res.sendStatus(500);
        }
    }
};
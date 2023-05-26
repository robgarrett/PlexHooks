import Database from "./db.js";

const processMediaItem = item => {
    console.log("Processing media item " + item.Metadata.ratingKey);
};

export default (req, res) => {
    if (typeof req.body === "undefined" || typeof req.body.payload === "undefined") {
        console.error("Expecting a body with a payload");
        res.sendStatus(500);
    } else {
        try {
            const payload = JSON.parse(req.body.payload);
            console.log(JSON.stringify(payload.Metadata));
            console.log("Got webhook for", payload.event);
            if (payload.event === "media.scrobble") {
                // Get reference to the database and store payload.
                const db = Database.instance;
                db.insert(payload, (err, _) => {
                    if (err) {
                        console.log(err);
                    }
                });
            } else if (payload.event === "media.stop") {
                // See if the current file was played to the end.
                const ratingKey = payload.Metadata.ratingKey;
                const db = Database.instance;
                db.find({ "Metadata.ratingKey": ratingKey,
                    "event": "media.scrobble" }, (err, docs) => {
                    if (err) {
                        console.log(err);
                    } else {
                        let processed = [];
                        docs.forEach(item => {
                            // eslint-disable-next-line no-underscore-dangle
                            processed += item._id;
                            processMediaItem(item);
                        });
                    }
                });
            }
            res.sendStatus(200);
        } catch (err) {
            res.sendStatus(500);
        }
    }
};

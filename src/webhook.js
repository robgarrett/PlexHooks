export default (req, res) => {
    if (typeof req.body === "undefined" || typeof req.body.payload === "undefined") {
        console.error("Expecting a body with a payload");
        res.sendStatus(500);
    } else {
        try {
            const payload = JSON.parse(req.body.payload);
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

/* eslint-disable arrow-body-style */
import axios from "axios";
import Database from "./db.js";
import Config from "./config.js";

const getEpisode = async ratingKey => {
    const config = Config.instance;
    const url = `${config.plexServer}/library/metadata/${ratingKey}?X-Plex-Token=${config.plexToken}&X-Plex-Client-Identifier=${config.clientId}&X-Plex-Platform=PlexWebHooks`;
    const res = await axios.get(url, {
        headers: {
            "Accept": "application/json"
        }
    }).
        then(response => response).
        catch(err => console.log(err));
    console.log(JSON.stringify(res.data));
    return res.data;
};

const processMediaItemAsync = async item => {
    // We only process TV shows because I don't want my movies disappearing :)
    if (null !== item && item.Metadata.type === "episode") {
        console.log("Processing media item " + item.Metadata.ratingKey);
        // Get the episode details from plex server.
        const episode = await getEpisode(item.Metadata.ratingKey);
        // Metadata is an array, should only have one of the episode.
        if (episode.MediaContainer.Metadata.length === 1) {
            const metadata = episode.MediaContainer.Metadata[0];
            const viewCount = metadata.viewCount;
            // Make sure episode has been viewed.
            if (typeof viewCount !== "undefined" && viewCount >= 1) {
                // Find the location on disk.
                metadata.Media.forEach(media => {
                    media.Part.forEach(part => {
                        console.log(`Found an episode part ready for delation: ${part.file}`);
                    });
                });
            }
        } else {
            console.log(`Found multiple media elements in JSON ${item}`);
        }
    }
};

export default async (req, res) => {
    if (typeof req.body === "undefined" || typeof req.body.payload === "undefined") {
        console.error("Expecting a body with a payload");
        res.sendStatus(500);
    } else {
        try {
            const payload = JSON.parse(req.body.payload);
            console.log("Got webhook for", payload.event);
            console.log(JSON.stringify(payload));
            const ratingKey = payload.Metadata.ratingKey;
            if (payload.event === "media.scrobble") {
                // Get reference to the database and store payload.
                const db = Database.instance;
                db.insert(payload, (err, _) => {
                    if (err) {
                        console.log(err);
                    }
                });
            } else if (payload.event === "media.stop") {
                const userId = payload.Account.id;
                const db = Database.instance;
                const items = await db.asyncFind({
                    "Metadata.ratingKey": ratingKey,
                    "Account.id": userId,
                    "event": "media.scrobble"
                }).catch(err => console.log(err));
                // Process items.
                await Promise.all(items.map(async i => {
                    await processMediaItemAsync(i);
                }));
            }
            res.sendStatus(200);
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    }
};

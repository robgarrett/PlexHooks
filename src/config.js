import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const constructorLock = Symbol("Constructor lock");
const singletonInstance = Symbol("Config instance");

// eslint-disable-next-line no-underscore-dangle
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default class Config {

    /*
     * Constructor lock prevents class from being instantiate via 'new Database()'
     * because constructorLock exists only in this file
     */
    constructor(lock) {
        if (lock !== constructorLock) {
            throw new Error("Cannot instantiate Config directly. Use getter \"instance\".");
        }
    }

    static get instance() {
        if (!this[singletonInstance]) {
            // Create a new instance of the Config singleton.
            this[singletonInstance] = new Config(constructorLock);
            // Load config.
            const configPath = path.join(__dirname, "appSettings.json");
            const data = fs.readFileSync(configPath);
            if (null !== data) {
                this[singletonInstance].config = JSON.parse(data);
            }
        }
        return this[singletonInstance].config;
    }
}

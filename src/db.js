import path from "path";
import { fileURLToPath } from "url";
import Datastore from "nedb";
import { AsyncNedb } from "nedb-async";

const constructorLock = Symbol("Constructor lock");
const singletonInstance = Symbol("Database instance");

// eslint-disable-next-line no-underscore-dangle
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default class Database {

    /*
     * Constructor lock prevents class from being instantiate via 'new Database()'
     * because constructorLock exists only in this file
     */
    constructor(lock) {
        if (lock !== constructorLock) {
            throw new Error("Cannot instantiate Database directly. Use getter \"instance\".");
        }
    }

    static get instance() {
        if (!this[singletonInstance]) {
            // Create a new instance of the Database singleton.
            this[singletonInstance] = new Database(constructorLock);
            // Provision the database if not exists.
            this[singletonInstance].db = new AsyncNedb({
                filename: path.join(__dirname, "datastore.dat"),
                autoload: true
            });
            this[singletonInstance].db.loadDatabase();
        }
        return this[singletonInstance].db;
    }
}

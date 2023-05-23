import axios from "axios";

/**
 * Class to facilitate the different web requests needed to query the Plex OAuth API
 */
export class RequestHelper {

    /**
     * Make a GET request to the specified endpoint
     * @param {string} url Request URL
     * @param {class} headers Additional headers to be passed to the request
     * @returns {Promise} A promise containing the result of the GET request
     */
    static async get(url, headers) {
        const response = await axios.
            get(url, {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    ...headers
                }
            });
        return response.data;
    }

    /**
     * Make a POST request to the specified endpoint
     * @param {string} url Request URL
     * @param {string} body Body as a JSON String
     * @param {class} headers Additional headers to be passed to the request
     * @returns {Promise} A promise containing the result of the POST request
     */
    static async post(url, body, headers) {
        const response = await axios.
            post(url, body, {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    ...headers
                }
            });
        return response.data;
    }
}

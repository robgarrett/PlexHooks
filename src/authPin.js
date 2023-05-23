import { RequestHelper } from "./requestHelper";
import { LinkHelper } from "./linkHelper.js";
import { Utils } from "./utils.js";

export class AuthPin {

    /**
     * Request's an OAuth Pin from the Plex API, which is used to get the Auth Token
     * @param {class} clientInfo Client information to send to the Plex API
     * @returns {Promise} The hosted ui URL
     */
    async getPin(clientInfo) {
        const response = await RequestHelper.post(
            `${LinkHelper.PLEX_PIN_BASE_PATH}/pins?strong=true`,
            "",
            { ...LinkHelper.getHeaders(clientInfo) }
        );
        return response;
    }

    /**
     * Sends repeated requests to the Plex Pin API with the provided pin id. It will then return
     * the auth token if it gets one, or null if it runs out of retries.
     * @param {class} clientInfo Client information to send to the Plex API
     * @param {number} pinId The id of the Plex pin to query for
     * @param {number} requestDelay The delay in seconds to wait between each poll
     * @param {number} maxRetries The number of retries before returning null
     * @returns {Promise} The auth token if found or null
     */
    // eslint-disable-next-line max-params
    async pollForAuthToken(clientInfo, pinId, requestDelay, maxRetries) {
        if (requestDelay < 1000) {
            // eslint-disable-next-line no-param-reassign
            requestDelay = 1000;
        }
        const response = await RequestHelper.get(`${LinkHelper.PLEX_PIN_BASE_PATH}/pins/${pinId}`, {
            ...LinkHelper.getHeaders(clientInfo)
        });
        if (response) {
            const pinData = response;
            if (pinData.authToken) {
                return pinData.authToken;
            }
            if (maxRetries <= 0) {
                return null;
            }
            return Utils.wait(
                () => this.pollForAuthToken(
                    clientInfo,
                    pinId,
                    requestDelay,
                    maxRetries - 1
                ),
                requestDelay
            );

        }
        return null;
    }
}

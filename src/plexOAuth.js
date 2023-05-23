import { AuthPin } from "./AuthPin";
import { LinkHelper } from "../helpers/LinkHelper";
import { Validators } from "../helpers/Validators";

export class PlexOauth {

    /**
     * Create an instance of the 'PlexOauth' class
     * @param {class} clientInfo Client info
     */
    constructor(clientInfo) {
        this.clientInfo = clientInfo;
        for (const validator of Validators.clientDetailsValidators) {
            validator(clientInfo);
        }
        this.authPin = new AuthPin();
    }

    /**
     * Request the hosted UI link for your app. A user will use this link to sign in and authenticate with Plex.
     * This gets returned with the pin id needed to query the Plex Pin API for the auth token
     * @returns {Promise} [hostedUIUrl, pinId] - Returns a promise of the hosted login URL and the pin Id as a tuple
     */
    async requestHostedLoginURL() {
        const response = await this.authPin.
            getPin(this.clientInfo).
            then(codeResponse => {
                let link = `${LinkHelper.PLEX_AUTH_BASE_PATH}#?code=${codeResponse.code}&context[device][product]=${this.clientInfo.product}&context[device][device]=${this.clientInfo.device}&clientID=${codeResponse.clientIdentifier}`;
                if (this.clientInfo.forwardUrl) {
                    link += `&forwardUrl=${this.clientInfo.forwardUrl || ""}`;
                }
                return [
                    this.clientInfo.urlencode ? encodeURI(link) : link,
                    codeResponse.id
                ];
            });
        return response;
    }

    /**
     * After a user signs in with the hosted UI, we need to check the Plex API for the auth token.
     * This function will poll their API looking for the auth token and returning it if found.
     * If the auth token is not found, this function will return null
     * @param {number} pinId The pinId to query for
     * @param {number} requestDelay The amount of delay in milliseconds. Can not go below 1000 (1 second)
     * @param {number} maxRetries The maximum number of retries until an auth token is received
     * @returns {Promise} The authtoken if found or null
     */
    async checkForAuthToken(pinId, requestDelay, maxRetries) {
        if (!pinId) {
            throw new Error("Pin Id is not set - Unable to poll for auth token without id");
        }

        /*
         * If 'requestDelay' or 'maxRetries' is not set, then we will treat this
         * as a single request, so we only request the auth token from the api once
         */
        // eslint-disable-next-line no-param-reassign
        requestDelay = requestDelay || 1000;
        // eslint-disable-next-line no-param-reassign
        maxRetries = maxRetries || 0;
        const response = await this.authPin.
            pollForAuthToken(this.clientInfo, pinId, requestDelay, maxRetries).
            then(authToken => authToken).
            catch(err => {
                throw err;
            });
        return response;
    }
}

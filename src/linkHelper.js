/**
 * Contains a series of helper functions and values for getting and building the url's needed to
 * request a Plex pin and token
 */
export class LinkHelper {
    static PLEX_PIN_BASE_PATH = "https://plex.tv/api/v2";

    static PLEX_AUTH_BASE_PATH = "https://app.plex.tv/auth";

    static PLEX_DEFAULT_PLATFORM = "Web";

    /**
     * Returns the headers needed to make requests to the Plex API using the client info
     * @param {class} clientInfo Client info to build headers from
     * @returns {class} The headers needed to make the requests to the Plex API
     */
    static getHeaders(clientInfo) {
        return {
            "X-Plex-Client-Identifier": clientInfo.clientIdentifier,
            "X-Plex-Device": clientInfo.device,
            "X-Plex-Platform": clientInfo.platform || this.PLEX_DEFAULT_PLATFORM,
            "X-Plex-Product": clientInfo.product,
            "X-Plex-Version": clientInfo.version
        };
    }
}

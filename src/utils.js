export class Utils {

    /**
     * Returns the input function after waiting the specified amount of time
     * @param {Function} func The input function
     * @param {number} waitTime The amount of time in milliseconds to wait
     *
     * @returns {Promise<T>} A promise containing the value of the input function
     */
    static wait(func, waitTime) {
        return new Promise((resolve, _) => {
            setTimeout(() => {
                resolve(func());
            }, waitTime);
        });
    }

    /**
     * Converts input URL string into a 'URL' object and passes it to the specified validator function
     * @param {string} url The URL to validate
     * @param {function} validator The validation logic to apply to the URL
     * @returns {bool} True if the validation passes or false if it does not
     */
    static validateUrl(url, validator) {
        const u = new URL(url);
        return validator(u);
    }
}

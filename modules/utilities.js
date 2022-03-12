// utilities.js

const name = 'utilities';

/**
 * Function to generate a GUID/UUID using a pseudo-random number
 * @returns {string}    A GUID/UUID value
 */
function createUUID() {
    let s = [];
    let hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    let uuid = s.join("");
    return uuid;
}

/**
 * Function to find an object within an array based on the value of an attribute
 * @param   {array}     array   An array to be searched
 * @param   {string}    key     The name of the object attribute
 * @param   {string}    value   The value of the key to search for
 * @returns {array}             An array containing items matching the filter
 */
function filterArray(array, key, value) {
    let filteredData = [];
    for (var i = 0; i < array.length; i++) {
        if (array[i][key] === stringToBoolean(value)) {
            filteredData.push(array[i]);
        }
    }
    return filteredData;
}

/**
 * Function to find an object within an array based on the value of an attribute
 * @param   {array}     array   An array to be searched
 * @param   {string}    key     The name of the object attribute
 * @param   {string}    value   The value of the key to search for
 * @returns {int}               The index in the array
 */
function findObjectByKey(array, key, value) {
    for (var i = 0; i < array.length; i++) {
        if (array[i][key] === value) {
            return i;
        }
    }
    return null;
}

/**
 * Function to convert a string value into a boolean value based on standard convetions.
 * @param {string} str String value to interpret as true or false.
 * @returns {boolean}
 */
function stringToBoolean(str) {
    switch (str.toLowerCase().trim()) {
        case "true":
        case "yes":
        case "1":
            return true;
        case "false":
        case "no":
        case "0":
        case null:
            return false;
        default:
            return str;
    }
}

module.exports = {
    createUUID,
    filterArray,
    findObjectByKey,
    stringToBoolean
};
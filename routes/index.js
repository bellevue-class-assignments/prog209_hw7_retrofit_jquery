var express = require('express');
const req = require('express/lib/request');
var router = express.Router();

/* The Firearm class. */
class Firearm {
    constructor(inputManufacturer,
        inputModel,
        inputClass,
        inputCaliber,
        inputOwned,
        inputWanted) {
        this.ID = createUUID();
        // this.Action = inputAction;
        this.Class = inputClass;
        // this.Capacity = inputCapacity;
        // this.Description = inputDescription;
        // this.Length = inputLength;
        // this.LengthBarrel = inputLengthBarrel;
        // this.MagazineType = inputMagazineType;
        this.Manufacturer = inputManufacturer;
        this.Model = inputModel;
        this.Caliber = inputCaliber;
        this.Owned = inputOwned;
        this.Wanted = inputWanted;
        // this.URL = inputURL;
        // this.Weight = inputWeight;
        // this.YearEnd = inputYearEnd;
        // this.YearStart = inputYearStart;
    }
}

/* firearms array to hold all Firearm objects */
let firearms = [];

/* Seeding Firearm objects to the firearms array */
firearms.push(new Firearm("Hekler & Koch", "VP70Z", "Pistol", "9mm Parabellum", true, false));
firearms.push(new Firearm("Glock", "20", "Pistol", "10mm Auto", true, false));
firearms.push(new Firearm("Smith & Wesson", "M&P Bodyguard 380", "Pistol", ".380 ACP", true, false));
firearms.push(new Firearm("Springfield Armory", "XD45", "Pistol", ".45 ACP", true, false));
firearms.push(new Firearm("Springfield Armory", "M1A SOCOM 16 CQB RIFLE", "Rifle", ".308 Remington", false, true));
firearms.push(new Firearm("Ruger", "Precision 26\" MLOK", "Rifle", ".338 Lapua", false, true));
firearms.push(new Firearm("Walther", "WA 2000", "Rifle", ".300 Winchester Magnum", false, true));
firearms.push(new Firearm("Kel-Tec", "SU-16", "Rifle", "5.56mm NATO", false, true));
firearms.push(new Firearm("CZ", "Bren 2 MS Carbine", "Rifle", "5.56mm NATO", false, true));

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

/* GET json of all firearms in array. */
router.get('/firearm', function(req, res) {
    res.status(200).json(firearms);
});

/* GET json of a specific firearm */
router.get('/firearm/:ID([a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12})', (req, res) => {
    let index = findObjectByKey(firearms, "ID", req.params.ID);
    if (Number.isInteger(index)) {
        res.status(200).json(firearms[index]);
    } else {
        res.status(404).json({
            status: "error",
            "message": "No object found with ID of " + req.params.ID
        })
    }
})

router.get('/firearm/:filter([a-zA-Z]+=[a-zA-Z]+)', (req, res) => {
    let filteredFirearms = firearms;
    let key = req.params.filter.split('=')[0]
    let value = req.params.filter.split('=')[1]

    filteredFirearms = filterArray(filteredFirearms, key, value);
    res.status(200).json(filteredFirearms);
})

/* GET json of a specific firearm */
router.get('/firearm/:filter1([a-zA-Z]+=[a-zA-Z]+)-:filter2([a-zA-Z]+=[a-zA-Z]+)', (req, res) => {
    let filteredFirearms = firearms;
    let key1 = req.params.filter1.split('=')[0]
    let value1 = req.params.filter1.split('=')[1]
    let key2 = req.params.filter2.split('=')[0]
    let value2 = req.params.filter2.split('=')[1]

    filteredFirearms = filterArray(filteredFirearms, key1, value1);
    filteredFirearms = filterArray(filteredFirearms, key2, value2);
    res.status(200).json(filteredFirearms);
})

/* POST new firarm to array */
router.post('/firearm', (req, res) => {
    let newFirearm = req.body;
    firearms.push(newFirearm);

    let response = {
        status: 201,
        success: 'New object added successfully.'
    }
    res.end(JSON.stringify(response));
});

/* DELETE firearm from array */
router.delete('/firearm/:ID([a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12})', (req, res) => {
    let index = findObjectByKey(firearms, "ID", req.params.ID);
    if (Number.isInteger(index)) {
        firearms.splice(index, 1);

        let response = {
            status: 204,
            success: 'Object was successfully deleted.'
        }
        res.end(JSON.stringify(response));
    } else {
        res.status(404).json({
            status: "error",
            "message": "No object found with ID of " + req.params.ID
        })
    }
})

/* GET new UUID value. */
router.get('/uuid', (req, res) => {
    res.status(200).json({ "uuid": createUUID() })
})

module.exports = router;

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
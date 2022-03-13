// datastore.js
const name = 'datastore';
const { request } = require('express');

let fs = require('fs');
let Firearm = require('../modules/firearm');

let dataPath = 'data';
let dataPathExists = checkFolderExists(dataPath);
let firearms = [];

// start the process of loading data
if (dataPathExists) {
    firearms = loadData(dataPath);
} else {
    createFolderPath(dataPath);
    verfiyItemAccess(dataPath, 'rw');
    loadSeedData();
    if (!writeSeedDataToFiles(dataPath)) {
        console.log('One or more seed items were not successfully written!');
    };
}

function loadData(folderPath = 'test') {
    let returnData = [];
    fs.readdir(folderPath, (error, files) => {
        if (error) {

            return console.log('Unable to scan directory: ' + error);
        }
        files.forEach((file) => {
            let filePath = folderPath + '/' + file;
            let fileData = fs.readFileSync(filePath);
            let firearm = JSON.parse(fileData);
            returnData.push(firearm);
        });
    });
    return returnData;
}

/**
 * Function to verify the existence of a folder.
 * @param {string} folderPath The path to the folder to verify.
 * @returns {boolean}
 */
function checkFolderExists(folderPath = 'test') {
    if (fs.existsSync(folderPath)) {
        return true;
    } else {
        return false;
    }
}

/**
 * Function to create a folder at a specified path.
 * @param {*} folderPath The path to the folder to create.
 * @returns {boolean}
 */
function createFolderPath(folderPath = 'test') {
    let folderCreated = false;
    try {
        fs.mkdirSync(folderPath)
        folderCreated = true;
    } catch (error) {
        console.error(error);
    }
    return folderCreated;
}

/**
 * Function to verify specified access to an item.
 * @param {*} itemPath The path to the item to test against.
 * @param {*} permissions The level of access to test for. Requires 'r' or 'rw'.
 * @returns 
 */
function verfiyItemAccess(itemPath = 'test', permissions = 'r') {
    let requestedPermission = false;

    if (!checkPermissions(itemPath, permissions)) {
        requestedPermission = setPermissions(itemPath, permissions);

    }
    return requestedPermission;
}

/**
 * Function to check permissions to an item
 * @param {*} itemPath The path to the item to check
 * @param {*} permissions The access to check for. Requires 'r' or 'rw'.
 * @returns 
 */
function checkPermissions(itemPath = 'test', permissions = 'r') {
    let correct = false;

    switch (permissions) {
        case 'r':
            try {
                fs.accessSync(itemPath, fs.constants.R_OK);
                correct = true;
            } catch (error) {
                console.error('No Read access');
            }
        case 'rw':
            try {
                fs.accessSync(itemPath,
                    fs.constants.R_OK | fs.constants.W_OK);
                correct = true;
            } catch (err) {
                console.error('No Read and Write access');
            }
    }
    return correct;
}

/**
 * Function to set permissions on a folder / file.
 * @param {string} itemPath The item to set permissions on.
 * @param {string} permissions The level of persmissions to set. Requires 'r' or 'rw'.
 * @returns {boolean}
 */
function setPermissions(itemPath = 'test', permissions = 'r') {
    let complete = false;

    switch (permissions) {
        case 'r':
            try {
                fs.chmodSync(itemPath, fs.constants.S_IRUSR);
                fs.accessSync(itemPath, fs.constants.R_OK);
                complete = true;
                console.log('Permissions set correctly.');
            } catch (error) {
                console.error('Permissions update failed');
            }
        case 'rw':
            try {
                fs.chmodSync(itemPath,
                    fs.constants.S_IRUSR | fs.constants.S_IWUSR);
                fs.accessSync(itemPath,
                    fs.constants.R_OK | fs.constants.W_OK);
                complete = true;
                console.log('Permissions set correctly.');
            } catch (error) {
                console.error('Permissions update failed');
            }
    }
    return complete;
}

function loadSeedData() {
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
}

/**
 * Function to write seed data to data files so it persistss.
 * @param {string} dataFolder The location to write the files.
 * @returns {boolean}
 */
function writeSeedDataToFiles(dataFolder = 'test') {
    let complete = false;
    firearms.forEach((element, ) => {
        fileName = element.ID + '.json'
        filePath = dataFolder + '/' + fileName;
        if (!writeFile(filePath, element)) {
            console.log('Failed to write "' + filePath + '".');
        } else {
            complete = true;
        }
    });
    return complete;
}

/**
 * Function to write json object to file
 * @param {string} dataFilePath 
 * @param {object} dataObject 
 * @returns {boolean}
 */
function writeFile(dataFilePath = 'data/test.json', dataObject = { 'test': 'data' }) {
    let jsonContent = JSON.stringify(dataObject);

    fs.writeFileSync(dataFilePath, jsonContent, 'utf8', (error) => {
        if (error) {
            console.log('Failed to write file "' + dataFilePath + '". ' + error);
            return false;
        }
    });
    return true;
}

function deleteFile(dataFilePath = 'data/test.json') {
    fs.unlink(dataFilePath, function(error) {
        if (error) throw error;
        console.log('File deleted!');
    });
}

module.exports = {
    dataPath,
    deleteFile,
    firearms,
    writeFile
};
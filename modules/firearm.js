// firearm.js

const name = 'firearm';
let createUUID = require('./utilities.js').createUUID;

/**
 * Class defining a Firearm object.
 */
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

module.exports = Firearm;
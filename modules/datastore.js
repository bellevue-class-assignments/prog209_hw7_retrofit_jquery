// datastore.js

const name = 'datastore';

let Firearm = require('../modules/firearm');

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

module.exports = {
    firearms
};
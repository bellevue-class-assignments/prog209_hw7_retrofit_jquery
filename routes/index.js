let express = require('express');
const req = require('express/lib/request');
let router = express.Router();

// local module requires
let Firearm = require('../modules/firearm');
let createUUID = require('../modules/utilities').createUUID;
let findObjectByKey = require('../modules/utilities').findObjectByKey;
let filterArray = require('../modules/utilities').filterArray;
let dataPath = require('../modules/datastore').dataPath;
let deleteFile = require('../modules/datastore').deleteFile;
let firearms = require('../modules/datastore').firearms;
let writeFile = require('../modules/datastore').writeFile;

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
    let filePath = dataPath + '/' + newFirearm.ID + '.json';
    console.log(newFirearm);
    firearms.push(newFirearm);

    writeFile(filePath, newFirearm);


    let response = {
        status: 201,
        success: 'New object added successfully.'
    }
    res.end(JSON.stringify(response));
});

/* DELETE firearm from array */
router.delete('/firearm/:ID([a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12})', (req, res) => {
    let index = findObjectByKey(firearms, "ID", req.params.ID);
    let filePath = dataPath + '/' + req.params.ID + '.json';
    deleteFile(filePath);
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
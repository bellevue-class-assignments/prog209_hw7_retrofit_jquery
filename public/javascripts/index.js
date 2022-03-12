// create a local array to store the data
let firearmArray = [];

// calbers for inputCaliber
let caliberArray = [
    '.17 HMR',
    '.22 Long',
    '.22 Long Rifle',
    '.22 Short',
    '.22-250 Remington',
    '.221 Fireball',
    '.223 Remington',
    '.240 Weatherby Magnum',
    '.25 ACP',
    '.250 Savage',
    '.270 Winchester',
    '.30-06 Springfield',
    '.30-30 Winchester',
    '.300 Savage',
    '.300 Winchester Magnum',
    '.303 British',
    '.308 Winchester',
    '.32 ACP',
    '.327 Magnum',
    '.338 Lapua Magnum',
    '.357 Magnum',
    '.357 SIG',
    '.375 H&H Magnum',
    '.375 Weatherby Magnum',
    '.38 Special',
    '.38 Super',
    '.380 ACP',
    '.40 S&W',
    '.41 Magnum',
    '.410 2.5" chamber',
    '.410 3" chamber',
    '.44 Magnum',
    '.44 Special',
    '.45 ACP',
    '.45 GAP',
    '.45 Long Colt',
    '.450 Nitro Express',
    '.454 Casull',
    '.458 Winchester Magnum',
    '.460 S&W Magnum',
    '.460 Winchester Magnum',
    '.465 H&H Magnum',
    '.470 Nitro Express',
    '.480 Ruger',
    '.50 Action Express',
    '.500 Magnum',
    '.700 Nitro Express',
    '12 gauge, 2-3/4" chamber',
    '12 gauge, 3" chamber',
    '12 gauge, 3-1/2" chamber',
    '20 gauge, 2-3/4" chamber',
    '20 gauge, 2-5/8" chamber',
    '20 gauge, 3" chamber',
    '5.45x18mm',
    '5.45x39mm',
    '5.56mm NATO',
    '5.7x28mm FN',
    '6mm Remington',
    '6.5mm Creedmore',
    '6.5mm Mannlicher-Carcano',
    '6.5mm Mannlicher-Schoenauer',
    '6.5mm Swedish Mauser',
    '6.8mm Remington',
    '7mm Nambu',
    '7mm Weatherby-Magnum',
    '7mm-08 Remington',
    '7.62mm Nagant',
    '7.62mm NATO',
    '7.62mm Tokarev',
    '7.65mm Mannlicher',
    '7.62x39mm',
    '7.62x54mmR',
    '8mm Mauser',
    '8mm Remington Magnum',
    '9mm Ultra',
    '9mm Parabellum',
    '9mm Long',
    '10mm Auto'
]

/* The Firearm class. */
class Firearm {
    constructor(
        inputID,
        inputManufacturer,
        inputModel,
        inputClass,
        inputCaliber,
        inputOwned,
        inputWanted) {
        this.ID = inputID;
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

let selectedCaliber = null,
    selectedClass = null,
    isOwned = false,
    isWanted = false;

document.addEventListener("DOMContentLoaded", () => {

    // generate option elements for inputCaliber
    generateCaliberInput();

    // generate object list
    createList();

    // add button events ************************************************************************
    document.getElementById("buttonAdd").addEventListener("click", () => {

        let uuid;
        $.ajax({
            async: false,
            type: 'GET',
            url: '/uuid',
            success: (data) => {
                uuid = data;
            }
        });

        let newFirearm = new Firearm(
            uuid['uuid'],
            document.getElementById("inputManufacturer").value,
            document.getElementById("inputModel").value,
            selectedClass,
            selectedCaliber,
            isOwned,
            isWanted);

        $.ajax({
            url: '/firearm',
            type: 'POST',
            data: JSON.stringify(newFirearm),
            contentType: "application/json; charset=utf-8",
            success: function(result) {
                console.log(result);
            }
        });

        document.location.href = "index.html#ListAll";

        /* future fields for additional data
        document.getElementById("inputURL").value,
        selectedAction,
        document.getElementById("inputCapacity").value,
        document.getElementById("inputDescription").value,
        selectedMagazine,
        document.getElementById("inputLength").value,
        document.getElementById("inputLengthBarrel").value,
        document.getElementById("inputWeight").value,
        document.getElementById("inputDateStart").value,
        document.getElementById("inputDateEnd").value)
        */
    });
    // end of add button events ************************************************************************

    document.getElementById("buttonClear").addEventListener("click", () => {
        document.getElementById("inputManufacturer").value = "";
        document.getElementById("inputModel").value = "";
    });

    $(document).bind("change", "#inputCaliber", function(event, ui) {
        selectedCaliber = $('#inputCaliber').val();
    });

    $(document).bind("change", "#inputClass", function(event, ui) {
        selectedClass = $('#inputClass').val();
    });

    $(document).bind("change", "#inputOwned", function(event, ui) {
        isOwned = $('#inputOwned').is(':checked');
    });

    $(document).bind("change", "#inputWanted", function(event, ui) {
        isWanted = $('#inputWanted').is(':checked');
    });

    document.getElementById("deleteFirearm").addEventListener("click", () => {
        let localParm = localStorage.getItem('parm'); // get the unique key back from the dictionary
        deleteFirearm(localParm);
        createList(); // recreate li list after removing one
        document.location.href = "index.html#ListAll"; // go back to movie list 
    });

    // 3 sort button event methodsmanufacturerTitle
    document.getElementById("buttonSortManufacturer").addEventListener("click", () => {
        createList("divAllFirearms", "Manufacturer");
        document.location.href = "index.html#ListAll";
    });

    document.getElementById("buttonSortCaliber").addEventListener("click", () => {
        createList("divAllFirearms", "Caliber");
        document.location.href = "index.html#ListAll";
    });

    document.getElementById("buttonSortClass").addEventListener("click", () => {
        createList("divAllFirearms", "Class");
        document.location.href = "index.html#ListAll";
    });
    // end of sort button events ************************************************************************

    /**
     * Event listeners for "List Owned Firearms"
     */
    document.getElementById("buttonOwned").addEventListener("click", () => {
        createList("divOwnedFirearms", null, "Owned=true");
        document.location.href = "index.html#ListOwned";
    });

    document.getElementById("buttonOwnedPistol").addEventListener("click", () => {
        createList("divOwnedFirearms", null, "Owned=true-Class=Pistol");
        document.location.href = "index.html#ListOwned";
    });

    document.getElementById("buttonOwnedRifle").addEventListener("click", () => {
        createList("divOwnedFirearms", null, "Owned=true-Class=Rifle");
        document.location.href = "index.html#ListOwned";
    });

    document.getElementById("buttonOwnedShotgun").addEventListener("click", () => {
        createList("divOwnedFirearms", null, "Owned=true-Class=Shotgun");
        document.location.href = "index.html#ListOwned";
    });
    // end of owned button events ************************************************************************

    /**
     * Event listeners for "List Wanted Firearms"
     */
    document.getElementById("buttonWanted").addEventListener("click", () => {
        createList("divWantedFirearms", null, "Wanted=true");
        document.location.href = "index.html#ListWanted";
    });

    document.getElementById("buttonWantedPistol").addEventListener("click", () => {
        createList("divWantedFirearms", null, "Wanted=true-Class=Pistol");
        document.location.href = "index.html#ListWanted";
    });

    document.getElementById("buttonWantedRifle").addEventListener("click", () => {
        createList("divWantedFirearms", null, "Wanted=true-Class=Rifle");
        document.location.href = "index.html#ListWanted";
    });

    document.getElementById("buttonWantedShotgun").addEventListener("click", () => {
        createList("divWantedFirearms", null, "Wanted=true-Class=Shotgun");
        document.location.href = "index.html#ListWanted";
    });
    // end of wanted button events ************************************************************************

    // page before show code *************************************************************************
    $(document).on("pagebeforeshow", "#ListAll", (event) => { // have to use jQuery 
        createList("divAllFirearms");
    });

    $(document).on("pagebeforeshow", "#ListOwned", (event) => { // have to use jQuery
        createList("divOwnedFirearms", null, "Owned=True");
    });

    $(document).on("pagebeforeshow", "#ListWanted", (event) => { // have to use jQuery 
        createList("divWantedFirearms", null, "Wanted=True");
    });

    // need one for our details page to fill in the info based on the passed in ID
    $(document).on("pagebeforeshow", "#Details", (event) => {
        let localParm = localStorage.getItem('parm'); // get the unique key back from the dictionairy
        let localID = GetArrayPointer(localParm); // map to which array element it is

        document.getElementById("oneManufacturer").innerHTML = "Manufacturer: " + firearmArray[localID].Manufacturer;
        document.getElementById("oneModel").innerHTML = "Model: " + firearmArray[localID].Model;
        document.getElementById("oneCaliber").innerHTML = "Caliber: " + firearmArray[localID].Caliber;
        document.getElementById("oneClass").innerHTML = "Class: " + firearmArray[localID].Class;
        document.getElementById("oneOwned").innerHTML = "Owned: " + firearmArray[localID].Owned;
        document.getElementById("oneWanted").innerHTML = "Wanted: " + firearmArray[localID].Wanted;
    });
    // end of page before show code *************************************************************************

});
// end of wait until document has loaded event  *************************************************************************

/**
 * Function to add calibers to inputCaliber select list
 */
function generateCaliberInput() {
    let parentSelect = document.getElementById("inputCaliber");
    for (let i = 0; i < caliberArray.length; i++) {
        let caliberOption = document.createElement('option');
        caliberOption.value = caliberArray[i];
        caliberOption.innerHTML = caliberArray[i];
        parentSelect.appendChild(caliberOption);
    }
}

/**
 * Function to create a list of firearms
 * 
 * @param {string} parent       The parent div Id for the list creation
 * @param {string} sortOrder    The sort order, if any
 * @param {string} filters      The filters to use to create the list. Max of two filters.
 */
function createList(parent = "divAllFirearms", sortOrder = null, filters = null) {
    let firearmData;
    let url = '/firearm';

    if (filters) {
        url = url + '/' + filters;
    }
    $.ajax({
        async: false,
        type: 'GET',
        url: url,
        success: (data) => {
            firearmData = data;
        }
    });

    firearmArray = firearmData;

    if (sortOrder) {
        firearmArray.sort(dynamicSort(sortOrder));
    }

    let divFirearmList = document.getElementById(parent);

    while (divFirearmList.firstChild) { // remove any old data so don't get duplicates
        divFirearmList.removeChild(divFirearmList.firstChild);
    };

    let blankTitle = document.createElement('div');
    blankTitle.id = 'blankTitle';
    blankTitle.classList.add('tableName');

    let manufacturerTitle = document.createElement('div');
    manufacturerTitle.id = 'manufacturerTitle';
    manufacturerTitle.classList.add('tableName');
    manufacturerTitle.innerHTML = 'Manufacturer';

    let modelTitle = document.createElement('div');
    modelTitle.id = 'modelTitle';
    modelTitle.classList.add('tableName');
    modelTitle.innerHTML = 'Model';

    let caliberTitle = document.createElement('div');
    caliberTitle.id = 'caliberTitle';
    caliberTitle.classList.add('tableName');
    caliberTitle.innerHTML = 'Caliber';

    let classTitle = document.createElement('div');
    classTitle.id = 'classTitle';
    classTitle.classList.add('tableName');
    classTitle.innerHTML = 'Class';

    let ownedTitle = document.createElement('div');
    ownedTitle.id = 'ownedTitle';
    ownedTitle.classList.add('tableName');
    ownedTitle.innerHTML = 'Owned?';

    let wantedTitle = document.createElement('div');
    wantedTitle.id = 'wantedTitle';
    wantedTitle.classList.add('tableName');
    wantedTitle.innerHTML = 'Wanted?';

    let titleRow = document.createElement('div');
    titleRow.classList.add('tableRow');

    titleRow.appendChild(blankTitle);
    titleRow.appendChild(manufacturerTitle);
    titleRow.appendChild(modelTitle);
    titleRow.appendChild(caliberTitle);
    titleRow.appendChild(classTitle);
    titleRow.appendChild(ownedTitle);
    titleRow.appendChild(wantedTitle);

    divFirearmList.appendChild(titleRow);


    // let ul = document.createElement('ul');
    firearmArray.forEach(function(element, ) { // use handy array forEach method

        let detailsButton = document.createElement('button');
        detailsButton.innerText = "details";
        detailsButton.classList.add("oneFirearm")
        detailsButton.setAttribute("data-parm", element.ID);

        let itemDetails = document.createElement('div');
        itemDetails.classList.add('tableValue');
        itemDetails.appendChild(detailsButton);

        let itemManufacturer = document.createElement('div');
        itemManufacturer.classList.add('tableValue');
        itemManufacturer.innerHTML = element.Manufacturer;

        let itemModel = document.createElement('div');
        itemModel.classList.add('tableValue');
        itemModel.innerHTML = element.Model;

        let itemCaliber = document.createElement('div');
        itemCaliber.classList.add('tableValue');
        itemCaliber.innerHTML = element.Caliber;

        let itemClass = document.createElement('div');
        itemClass.classList.add('tableValue');
        itemClass.innerHTML = element.Class;

        let itemOwned = document.createElement('div');
        itemOwned.classList.add('tableValue');
        itemOwned.innerHTML = element.Owned;

        let itemWanted = document.createElement('div');
        itemWanted.classList.add('tableValue');
        itemWanted.innerHTML = element.Wanted;

        let itemRow = document.createElement('div');
        itemRow.classList.add('tableRow');
        itemRow.appendChild(itemDetails);
        itemRow.appendChild(itemManufacturer);
        itemRow.appendChild(itemModel);
        itemRow.appendChild(itemCaliber);
        itemRow.appendChild(itemClass);
        itemRow.appendChild(itemOwned);
        itemRow.appendChild(itemWanted);

        divFirearmList.appendChild(itemRow);
    });

    // now we have the HTML done to display out list, 
    // next we make them active buttons
    // set up an event for each new li item, 
    var buttonArray = document.getElementsByClassName("oneFirearm");
    Array.from(buttonArray).forEach((element) => {
        element.addEventListener('click', () => {
            // get that data-parm we added for THIS particular li as we loop thru them

            let parm = element.getAttribute("data-parm"); // passing in the record.Id
            localStorage.setItem('parm', parm);
            // get our hidden <p> and save THIS ID value in the localStorage "dictionairy"

            document.location.href = "index.html#Details";
        });
    });

};


/**
 * Function to delete one or more elements from an array
 * 
 * @param {string} id   The id of the firearm to delete
 */
function deleteFirearm(id) {
    $.ajax({
        async: false,
        type: 'DELETE',
        url: '/firearm/' + id,
        success: function(result) {
            alert(result);
        },
        error: function(xhr, textStatus, errorThrown) {
            alert("Server could not delete firearm with id " + id);
        }
    });
}

/**
 * Function to cycle thru an array of objects and find the element or elements with the matching
 * attribute value. Once a match is found, an array with the indexes in the array are returned.
 * 
 * @param   {string}    elementValue    The id value to search the array for.
 * @param   {string}    objectAttribute The attribute of the object to search for. if no value
 *                                      is provided, the string "ID" is used.
 *
 * @return  {int}   The index of the array corresponding to the object seached for.
 */
function GetArrayPointer(elementValue, objectAttribute = "ID") {
    let arrayIndexes = [];
    for (let index = 0; index < firearmArray.length; index++) {
        if (elementValue === firearmArray[index][objectAttribute]) {
            arrayIndexes.push(index);
        }
    }
    return arrayIndexes;
}

/**
 * Function to sort, alphabetically, an array of objects by some specific key.
 * https://ourcodeworld.com/articles/read/764/how-to-sort-alphabetically-an-array-of-objects-by-key-in-javascript
 * 
 * @param   {String}    property    Key of the object to sort.
 */
function dynamicSort(property) {
    var sortOrder = 1;

    if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }

    return function(a, b) {
        if (sortOrder == -1) {
            return b[property].localeCompare(a[property]);
        } else {
            return a[property].localeCompare(b[property]);
        }
    }
}

/**
 * Function to create a basic <li> element using the specified text, and appends it to the specified <ul> or
 * <ol>. If a class value is provided, it is also* assigned to the <li>.
 * @param    {String}    targetListId    the id of the parent list the <li> will be appended to
 * @param    {string}    listItemText    the text string to append to the <li>
 * @param    {string}    listItemClass   [optional] the class string to add to the <li>. if not
 *                                       provided no class attribute will be created.
 */
function createListItem(targetListId, listItemText, listItemClass = null) {
    let targetList = document.querySelector(targetListId);
    let listItem = document.createElement('li');
    if (listItemClass) {
        listItem.classList.add(listItemClass);
    }
    listItem.appendChild(document.createTextNode(listItemText));
    targetList.appendChild(listItem);
}
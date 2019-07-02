const csvtojson = require("csvtojson");
const jsontocsv = require("json2csv").parse;
const fs = require("fs");


// make insurance company directory
const dir = './insurance_companies'

try {
    if (!fs.existsSync(dir)) { // if dir doesn't exist, make it
        fs.mkdirSync(dir)
    }
} catch (err) {
    console.error(err)
}

// sort names by last, then first
const compareNames = function (a, b) {
    // split into first name and last name variables
    const splitStringA = a.First_Name_Last_Name.split(" ");
    const splitStringB = b.First_Name_Last_Name.split(" ");

    a.First_Name = splitStringA[0];
    a.Last_Name = splitStringA[splitStringA.length - 1];

    b.First_Name = splitStringB[0];
    b.Last_Name = splitStringB[splitStringB.length - 1];

    if (a.Last_Name < b.Last_Name) {
        return -1;
    }
    if (a.Last_Name > b.Last_Name) {
        return 1;
    }
    if (a.First_Name < b.First_Name) {
        return -1;
    }
    if (a.First_Name > b.First_Name) {
        return 1;
    }
    return;
}

// sort by increasing insurance versions
const compareInsVersions = function (a, b) {
    return b - a
};

function find_duplicate_in_array(arr) {
    var object = {};
    var result = [];

    arr.forEach(function (item) {
        if (!object[item])
            object[item] = 0;
        object[item] += 1;
    })

    for (var prop in object) {
        if (object[prop] >= 2) {
            result.push(prop);
        }
    }

    return result;

}
async function getCSV() {
    return csvtojson().fromFile("./data.csv")
        .then(async source => {
            const uniqueInsurance = await [...new Set(source.map(item => item.Insurance_Company))];

            for (i in uniqueInsurance) {
                const result = source.filter(element => element.Insurance_Company === uniqueInsurance[i]);
                const sortedResult = result.sort(compareNames);
                // TODO: sort results, remove First_Name, Last_Name properties (not included in original question)

                let userIdHolder = [];
                for (i in sortedResult) {
                    userIdHolder.push(sortedResult[i].Userid);
                }
                const duplicates = find_duplicate_in_array(userIdHolder);
                console.log(duplicates);


                // console.log(userIdHolder);



                const keys = Object.keys(source[0]);
                const csv = jsontocsv(sortedResult, {
                    fields: keys
                });
                fs.writeFileSync(dir + "/" + uniqueInsurance[i], csv);
            }
        }).catch();
}
getCSV();
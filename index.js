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
const compareFirstNames = function (a, b) {
    // split into first name and last name variables
    const splitStringA = a.First_Name_Last_Name.split(" ");
    const splitStringB = b.First_Name_Last_Name.split(" ");

    a.First_Name = splitStringA[0];
    b.First_Name = splitStringB[0];

    if (a.First_Name < b.First_Name) {
        return -1;
    }
    if (a.First_Name > b.First_Name) {
        return 1;
    }
    return 0;
}
const compareLastNames = function (a, b) {
    // split into first name and last name variables
    const splitStringA = a.First_Name_Last_Name.split(" ");
    const splitStringB = b.First_Name_Last_Name.split(" ");

    a.Last_Name = splitStringA[splitStringA.length - 1];
    b.Last_Name = splitStringB[splitStringB.length - 1];

    if (a.Last_Name < b.Last_Name) {
        return -1;
    }
    if (a.Last_Name > b.Last_Name) {
        return 1;
    }
    return 0;
}

// sort names by last, then first
const compareUserid = function (a, b, key) {
    // split into first name and last name variables

    if (a.Userid < b.Userid) {
        return -1;
    }
    if (a.Userid > b.Userid) {
        return 1;
    }
    return;
}
const removeDups = (companies) => {
    const noDups = companies.filter((curr, index) => {
        // base case

        if (index == 0) {
            return true;
        } else {
            return (companies[index].Userid === companies[index - 1].Userid) ? false : true;
        }


    });
    return noDups;
}

async function getCSV() {
    return csvtojson().fromFile("./data.csv")
        .then(async source => {
            const uniqueInsurance = await [...new Set(source.map(item => item.Insurance_Company))];

            for (i in uniqueInsurance) {
                const result = source.filter(element => {
                    return element.Insurance_Company === uniqueInsurance[i]
                });
                // transform data
                const sortedUserid = result.sort(compareUserid);
                const uniqueArray = removeDups(sortedUserid)
                const sortedFirstName = uniqueArray.sort(compareFirstNames);
                const sortedLastName = sortedFirstName.sort(compareLastNames);
                const sortedResult = sortedLastName
                // write data back to csv
                const keys = Object.keys(source[0]);
                const csv = jsontocsv(sortedResult, {
                    fields: keys
                });
                fs.writeFileSync(dir + "/" + uniqueInsurance[i], csv);
            }
        }).catch();
}
getCSV();
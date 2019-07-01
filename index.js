const csvtojson = require("csvtojson");
const jsontocsv = require("json2csv").parse;
const fs = require("fs");


// make insurance company directory
const dir = './insurance_companies'

try {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir)
    }
} catch (err) {
    console.error(err)
}

// sort names by last, then first
var compareNames = function (a, b) {
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

async function getCSV() {
    return csvtojson().fromFile("./data.csv")
        .then(async source => {
            const uniqueInsurance = await [...new Set(source.map(item => item.Insurance_Company))];

            for (i in uniqueInsurance) {
                const result = source.filter(element => element.Insurance_Company === uniqueInsurance[i]);
                const sortedResult = result.sort(compareNames);
                console.log({
                    sortedResult
                });

                const keys = Object.keys(source[0]);
                const csv = jsontocsv(sortedResult, {
                    fields: keys
                });

                fs.writeFileSync(dir + "/" + uniqueInsurance[i], csv);
            }
        }).catch();
}
getCSV();
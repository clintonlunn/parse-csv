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


async function getCSV() {
    return csvtojson().fromFile("./data.csv")
        .then(async source => {
            let uniqueInsurance = await [...new Set(source.map(item => item.Insurance_Company))];

            for (i in uniqueInsurance) {
                const result = source.filter(element => element.Insurance_Company === uniqueInsurance[i]);
                console.log(result);

                const keys = Object.keys(source[0]);
                const csv = jsontocsv(result, {
                    fields: keys
                });

                fs.writeFileSync(dir + "/" + uniqueInsurance[i], csv);
            }
        }).catch();
}
getCSV();
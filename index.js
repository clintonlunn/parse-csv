const csvtojson = require("csvtojson");
const jsontocsv = require("json2csv").parse;
const FileSystem = require("fs");


// create insurance company files
async function createInsuranceCompanyFiles(source) {
    // create array of unique insurance companies
    let uniqueInsurance = await [...new Set(source.map(item => item.Insurance_Company))];
    // write to file
    // uniqueInsurance.map(insuranceCompany => {
    //     FileSystem.writeFile("./insurance_companies/" + insuranceCompany.replace(/[^0-9a-z]/gi, '') + ".json").catch();
    // });
    return uniqueInsurance;
}


async function getCSV() {
    return csvtojson().fromFile("./data.csv")
        .then(async source => {
            let insuranceCompanies = await createInsuranceCompanyFiles(source);


            for (i in insuranceCompanies) {
                const insuranceName = insuranceCompanies[i].replace(/[^0-9a-z]/gi, '');


                for (i in source) {

                    let formattedSource = source[i].Insurance_Company.replace(/[^0-9a-z]/gi, '');
                    if (formattedSource === insuranceName) {
                        const filepath = "./insurance_companies/" + insuranceName + ".json";
                        // append that object to the insurance file
                        // set up stream

                        FileSystem.appendFile(filepath, JSON.stringify(source[i]) + ", ", (err) => {
                            if (err) throw err;
                            console.log('The "data to append" was appended to file!');
                        });
                    }
                }
            }


        }).catch();
}
const jsonResult = getCSV();

// console.log(jsonResult);
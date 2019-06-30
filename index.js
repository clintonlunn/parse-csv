const csvtojson = require("csvtojson");
const jsontocsv = require("json2csv").parse;
const FileSystem = require("fs");

csvtojson().fromFile("./data.csv").then(source => {
    console.log(source);

    var csv = jsontocsv(source, {
        fields: ["First_Name", "Last_Name", "Insurance_Company", "Version"]
    });
    FileSystem.writeFileSync("./destination.csv", csv);
});
const fs = require('fs');
//const canvas = require('canvas-wrapper');
const d3 = require('d3-dsv');

function convertCSV(csvString) {
    return new Promise((resolve, reject) => {
        resolve(d3.csvParse(csvString));
    });
}

function readCSV() {
    return new Promise((resolve, reject) => {
        fs.readFile('Spring Online Course Copy - Semester Blueprints.csv', 'utf8', (err, data) => {
            if (err) {
                reject(err);
                return;
            } else {
                resolve(data);
            }

        });
    });


}

function main() {
    readCSV()
        .then(convertCSV)
        .then(console.log);
}

main();

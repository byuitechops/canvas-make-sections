/* eslint no-console:0 */

const fs = require('fs');
const d3 = require('d3-dsv');
const asyncLib = require('async');
const chalk = require('chalk');

//const unlinkBP = require('./unlinkBP.js');
// const setSettings = require('./setSettings.js');
// const enableBP = require('./enableBP.js');
const copyGroups = require('./copyGroups.js');
// const latePolicy = require('./latePolicy.js');
// const publishCourse = require('./publishCourse.js');
// const lockModules = require('./lockModules.js);

function doWork(course, eachCB) {
    asyncLib.waterfall([
        asyncLib.constant(course),
        //unlinkBP,
        // setSettings,
        //enableBP,
        copyGroups,
        //latePolicy,
        // sectionSettings,
        // lockModules,
    ], eachCB);
}

function readCSV(cb) {
    fs.readFile('Spring Online Course Copy - Semester Blueprints.csv', 'utf8', (err, data) => {
        if (err) {
            cb(err, null);
            return;
        }
        // parse CSV
        data = d3.csvParse(data);
        cb(null, data);
    });
}

function main() {
    readCSV((err, csvFile) => {
        if (err) {
            console.error(chalk.red(err.stack));
            return;
        }

        asyncLib.eachSeries([csvFile], doWork, (err) => {
            if (err) {
                console.error(chalk.red(err.stack));
                return;
            }
            console.log(chalk.blue('Done! :D'));
        });

    });
}

main();
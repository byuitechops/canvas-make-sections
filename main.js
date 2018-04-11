/* eslint no-console:0 */

const fs = require('fs');
const d3 = require('d3-dsv');
const asyncLib = require('async');
const chalk = require('chalk');
const canvas = require('canvas-wrapper');

const unlinkBP = require('./unlinkBP.js');
const setSettings = require('./setSettings.js');
const enableBP = require('./enableBP.js');
const copyGroups = require('./copyGroups.js');
const latePolicy = require('./latePolicy.js');
const lockModules = require('./lockModules.js');
// const publishCourse = require('./publishCourse.js');

function syncCourse(course, eachCB) {
    asyncLib.waterfall([
        asyncLib.constant(course),
        unlinkBP,
        enableBP,
        setSettings,
        copyGroups,
        latePolicy,
        lockModules,
        // sectionSettings, // FOR SECTIONS ONLY!
    ], eachCB);
}

function getOU(course, eachCB) {
    var sisID = encodeURI(`sis_course_id:${course.course_id}`);
    canvas.get(`/api/v1/courses/${sisID}`, (getErr, courses) => {
        if (getErr) {
            console.log('Error getting course OU');
            eachCB(getErr);
        } else if (courses[0].id == undefined) {
            console.log('Course OU Empty');
            eachCB(new Error(`Course OU Empty ${courses}`));
        } else {
            course.courseOU = courses[0].id;
            syncCourse(course, eachCB);
        }
    });
}



function readCSV(cb) {
    fs.readFile('Spring Online Course Copy - Semester Blueprints2.csv', 'utf8', (err, data) => {
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

        // asyncLib.eachSeries(csvFile, syncCourse, (err) => {
        asyncLib.eachSeries(csvFile, getOU, (err) => {
            if (err) {
                console.error(chalk.red(err.stack));
                return;
            }
            console.log(chalk.blue('Done! :D'));
        });

    });
}

main();
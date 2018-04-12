/* eslint no-console:0 */

const fs = require('fs');
const d3 = require('d3-dsv');
const asyncLib = require('async');
const chalk = require('chalk');
const canvas = require('canvas-wrapper');

module.exports = (tasks, csvPath) => {

    function syncCourse(course, eachCB) {
        console.log(`\n${chalk.blue(course.short_name)}`);
        var waterfallTasks = [asyncLib.constant(course), ...tasks];

        asyncLib.waterfall(waterfallTasks, eachCB);
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
        fs.readFile(csvPath, 'utf8', (err, data) => {
            if (err) {
                cb(err, null);
                return;
            }
            // parse CSV
            data = d3.csvParse(data);
            cb(null, data);
        });
    }

    /* START HERE */
    readCSV((err, csvFile) => {
        if (err) {
            console.error(chalk.red(err.stack));
            return;
        }
        asyncLib.eachSeries(csvFile, getOU, (err) => {
            if (err) {
                console.error(chalk.red(err.stack));
                return;
            }
            console.log(chalk.blue('Done! :D'));
        });

    });
};
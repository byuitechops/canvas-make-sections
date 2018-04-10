/* eslint no-console:0 */

const canvas = require('canvas-wrapper');
const chalk = require('chalk');

module.exports = (course, callback) => {
    var courseID = encodeURI(`sis_course_id:${course.course_id}`);
    canvas.put(`/api/v1/courses/${courseID}`, { 'course[blueprint]': true }, (err, body) => {
        if (err) {
            console.log('Error setting new course as a blueprint');
            console.error(chalk.red(err.stack));
            callback(err, course);
        } else {
            console.log(chalk.blue(`Blueprint course Enabled - ${course.course_id}`));
            callback(null, course);
        }
    });
};
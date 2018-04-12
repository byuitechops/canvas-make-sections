/* eslint no-console:0 */

const canvas = require('canvas-wrapper');
const chalk = require('chalk');

module.exports = (course, callback) => {
    var sisID = encodeURI(`sis_course_id:${course.course_id}`);
    var putObj = {
        'course[blueprint_restrictions]': {
            content: false,
            points: true,
            due_dates: false,
            availability_dates: false
        }
    };

    canvas.put(`/api/v1/courses/${sisID}`, putObj, (putErr, updateCourse) => {
        if (putErr) {
            console.log('Error enabling BP item locking');
            console.error(chalk.red(putErr));
        } else {
            console.log(chalk.green('Updated course settings'));
        }
        callback(null, course);
    });
};
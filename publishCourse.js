/* eslint no-console:0 */

const canvas = require('canvas-wrapper');
const chalk = require('chalk');

module.exports = (course, callback) => {
    var sisID = encodeURI(`sis_course_id:${course.course_id}`),
        putObj = {
            'offer': true
        };

    canvas.put(`/api/v1/courses/${sisID}`, putObj, (putErr, updatedCourse) => {
        if (putErr) {
            console.log('Error while publishing the course');
            console.error(chalk.red(putErr));
        } else {
            console.log(`Successfully published ${updatedCourse.course_code}: ${updatedCourse.id}`);
        }
        callback(null, course);
    });
};
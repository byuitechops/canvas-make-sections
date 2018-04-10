/* eslint no-console:0 */

const canvas = require('canvas-wrapper');
const chalk = require('chalk');

module.exports = (course, callback) => {
    var sisID = encodeURI(`sis_course_id:${course.course_id}`),
        putObj = {
            'course[is_public_to_auth_users]': true
        };

    canvas.put(`/api/v1/courses/${sisID}`, putObj, (putErr, updatedCourse) => {
        if (putErr) {
            console.log('Error while publishing the course');
            console.error(chalk.red(putErr));
        } else {
            console.log(`Successfully published ${course.updatedCourse.name}`);
            console.log(`Course ID: ${updatedCourse.id}`);
        }
        callback(null, course);
    });
};
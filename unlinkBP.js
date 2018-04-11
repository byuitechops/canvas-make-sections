/* eslint no-console:0 */

const canvas = require('canvas-wrapper');
const chalk = require('chalk');

module.exports = (course, callback) => {

    /* ERROR this doesn't actually seem to do anything... */

    var bpCourseID = encodeURI(`sis_course_id:${course.blueprint_course_id}`);
    // courseID = encodeURI(`sis_course_id:${course.course_id}`);
    canvas.putJSON(`/api/v1/courses/${bpCourseID}/blueprint_templates/default/update_associations`, {
        'course_ids_to_remove': [course.courseOU]
    }, (err, body) => {
        if (err) {
            console.log(chalk.red(err.stack));
            callback(err, course);
        } else {
            console.log(chalk.green(`Blueprint course disassociated with the Master course - ${course.course_id}`));
            callback(null, course);
        }
    });
};
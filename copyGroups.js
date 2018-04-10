/* eslint no-console:0 */
const canvasCopyGroups = require('canvas-copy-groups');
const chalk = require('chalk');

module.exports = (course, callback) => {
    // sourceID, targetID, deleteDefault
    canvasCopyGroups(`sis_course_id:${course.blueprint_course_id}`, `sis_course_id:${course.course_id}`)
        .then(() => {
            console.log(chalk.blue(`Copying groups complete - ${course.course_id}`));
            callback(null, course);
        })
        .catch((err) => {
            console.error(chalk.red(err.stack));
            callback(null, course);
        });
};
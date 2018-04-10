const canvas = require('canvas-wrapper');
const chalk = require('chalk');

module.exports = (course, callback) => {
    canvas.put(`/api/v1/courses/sis_course_id:${course.blueprint_course_id}/blueprint_templates/:template_id/update_associations`,
        [null, course.course_id], (err) => {
            if (err) {
                console.log(chalk.red(err.stack));
                callback(null, course);
            } else {
                console.log(chalk.blue(`Blueprint course disassociated with the Master course - ${course.course_id}`));
                callback(null, course);
            }
        });
};
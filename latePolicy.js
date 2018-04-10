const canvas = require('canvas-wrapper');
const chalk = require('chalk');

module.exports = (course, callback) => {

    canvas.get(`/api/v1/courses/sis_course_id:${encodeURI(course.blueprint_course_id)}/late_policy`, (err, data) => {
        if (err) {
            console.log(chalk.red(err.stack));
            callback(null, course);
            return;
        } else {
            canvas.put(`/api/v1/courses/${course.course_id}/ late_policy`, data, (err, data) => {
                if (err) {
                    console.log(chalk.red(err.stack));
                } else {
                    console.log(chalk.blue(`Late Policy Updated - ${course.course_id}`));
                }
                callback(null, course);
            });
        }
    });
};
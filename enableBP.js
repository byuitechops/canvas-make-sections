const canvas = require('canvas-wrapper');
const chalk = require('chalk');

module.exports = (course, callback) => {
    canvas.put(`/api/v1/courses/${course.course_id}`, { 'course[blueprint]': true }, (err) => {
        if (err) {
            console.log(chalk.red(err.stack));
            callback(null, course);
        } else {
            console.log(chalk.blue(`Blueprint course Enabled - ${course.course_id}`));
            callback(null, course);
        }
    });
};
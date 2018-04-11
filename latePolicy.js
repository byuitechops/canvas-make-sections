/* eslint no-console:0 */

const canvas = require('canvas-wrapper');
const chalk = require('chalk');

module.exports = (course, callback) => {
    canvas.get(`/api/v1/courses/sis_course_id:${encodeURI(course.blueprint_course_id)}/late_policy`, (err, data) => {
        if (err) {
            if (err.message.includes('404')) {
                console.log(chalk.yellow('No Late policy found'));
            } else {
                console.log(chalk.red(err.stack));
            }
            callback(null, course);
        } else {
            var masterLatePolicy = {
                'late_policy[missing_submission_deduction_enabled]': data[0].late_policy.missing_submission_deduction_enabled,
                'late_policy[missing_submission_deduction]': data[0].late_policy.missing_submission_deduction,
                'late_policy[late_submission_deduction_enabled]': data[0].late_policy.late_submission_deduction_enabled,
                'late_policy[late_submission_deduction]': data[0].late_policy.late_submission_deduction,
                'late_policy[late_submission_interval]': data[0].late_policy.late_submission_interval,
                'late_policy[late_submission_minimum_percent_enabled]': data[0].late_policy.late_submission_minimum_percent_enabled,
                'late_policy[late_submission_minimum_percent]': data[0].late_policy.late_submission_minimum_percent,
            };
            canvas.post(`/api/v1/courses/sis_course_id:${course.course_id}/late_policy`, masterLatePolicy, (err) => {
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
/* eslint no-console:0 */
const chalk = require('chalk');
const canvas = require('canvas-wrapper');

module.exports = (course, callback) => {
    // enable general locked objects (points)

    
    function updateSettings(description) {
        /* set course format to online */
        var newSIS = encodeURI(`sis_course_id:${course.blueprint_course_id}`),
            putObj = {
                'course[course_format]': 'online',
                'course[grading_standard_id]': 1,
                'course[blueprint_restrictions]': {
                    content: false,
                    points: true,
                    due_dates: false,
                    availability_dates: false
                }
            };
        
        /* copy over course description */
        if (description !== null) {
            putObj['course[public_description]'] = description;
        }

        canvas.put(`api/v1/courses/${newSIS}`, putObj, (putErr, updateCourse) => {
            if (putErr) {
                console.error(chalk.red(putErr.stack));
            }
            callback(putErr, course);
        });
    }

    function getOldDescription() {
        var parentSIS = encodeURI(`sis_course_id:${course.course_id}`);
        canvas.get(`api/v1/courses/${parentSIS}`, (err, oldCourse) => {
            if (err) {
                console.log('Error getting course description');
                console.error(chalk.red(err.stack));
                updateSettings(null);
                return;
            }
            updateSettings(oldCourse.public_description);
        });
    }

    getOldDescription();
};
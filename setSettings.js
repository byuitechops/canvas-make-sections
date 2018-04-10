/* eslint no-console:0 */
const chalk = require('chalk');
const canvas = require('canvas-wrapper');

// module.exports = (course, callback) => {
function stuff(course, callback) {

    function enableNewGradebook() {
        // var sisID = encodeURI(`sis_course_id:${course.course_id}`);
        var sisID = course.course_id,
            putObj = {state: 'on'};

        canvas.put(`/api/v1/courses/${sisID}/features/flags/new_gradebook`, putObj, (err, newFeatures) => {
            if (err) {
                console.error(chalk.red(err));
            } else {
                console.log('Enabled new gradebook');
            }

            callback(null, course);
        });

    }

    function updateSettings(description) {
        /* enable general locked objects (points) */
        /* set course format to online */
        // var newSIS = encodeURI(`sis_course_id:${course.course_id}`),
        var newSIS = course.course_id,
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
        // ERROR not working
        if (description !== null) {
            putObj['course[public_description]'] = description;
        }

        canvas.put(`/api/v1/courses/${newSIS}`, putObj, (putErr, updateCourse) => {
            if (putErr) {
                console.error(chalk.red(putErr));
            } else {
                console.log('Updated course settings');
            }
            enableNewGradebook();
        });
    }

    function getOldDescription() {
        // var parentSIS = encodeURI(`sis_course_id:${course.blueprint_course_id}`);
        var parentSIS = course.blueprint_course_id; // TESTING
        canvas.get(`/api/v1/courses/${parentSIS}`, (err, oldCourse) => {
            if (err) {
                console.log('Error getting course description');
                console.error(chalk.red(err.stack));
                updateSettings(null);
                return;
            }
            console.log('retrieved old description');
            updateSettings(oldCourse[0].public_description);
        });
    }

    getOldDescription();
}

stuff({
    course_id: 11123,
    blueprint_course_id: 11122 // the master. idk why
}, (err, course) => {
    if (err) console.error(err);
    else console.log('Done! :D');
});
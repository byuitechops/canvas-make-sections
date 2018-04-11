/* eslint no-console:0 */
const chalk = require('chalk');
const canvas = require('canvas-wrapper');

module.exports = (course, callback) => {
    // function stuff(course, callback) { // TESTING

    function enableNewGradebook() {
        var sisID = encodeURI(`sis_course_id:${course.course_id}`),
            // var sisID = course.course_id, // TESTING
            putObj = {
                state: 'on'
            };

        canvas.put(`/api/v1/courses/${sisID}/features/flags/new_gradebook`, putObj, (err, newFeatures) => {
            if (err) {
                console.log('Error enabling new gradebook');
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
        var newSIS = encodeURI(`sis_course_id:${course.course_id}`),
            // var newSIS = course.course_id, // TESTING
            putObj = {
                'course[course_format]': 'online',
                // 'course[grading_standard_id]': 1, /// IDK WHAT THIS DOES....
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

        canvas.put(`/api/v1/courses/${newSIS}`, putObj, (putErr, updateCourse) => {
            if (putErr) {
                console.log('Error updating settings');
                console.error(chalk.red(putErr));
            } else {
                console.log('Updated course settings');
            }

            enableNewGradebook();
        });
    }

    function getOldDescription() {
        var parentSIS = encodeURI(`sis_course_id:${course.blueprint_course_id}`);
        // var parentSIS = course.blueprint_course_id; // TESTING
        canvas.get(`/api/v1/courses/${parentSIS}`, (err, oldCourse) => {
            if (err) {
                console.log('Error getting course description');
                console.error(chalk.red(err.stack));
                updateSettings(null);
                return;
            }
            // TODO for some reason this property is not included on the returned course object
            if (oldCourse[0].public_description !== undefined) {
                console.log('retrieved old description');
            } else {
                console.log('Unable to pull description or description was empty');
            }
            
            updateSettings(oldCourse[0].public_description);
        });
    }

    getOldDescription();
};

// TESTING
/* stuff({
    course_id: 11123,
    blueprint_course_id: 11122 // the master. idk why
}, (err, course) => {
    if (err) console.error(err);
    else console.log('Done! :D');
}); */
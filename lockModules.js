/* eslint no-console:0 */

const canvas = require('canvas-wrapper');
const chalk = require('chalk');
const asyncLib = require('async');

module.exports = (course, callback) => {
// function work(course, callback) {
    var itemsToLock = [];
    var courseID = encodeURI(`sis_course_id:${course.course_id}`);
    var lockCount = 0;
    // var courseID = course.course_id; //TESTING


    function lockItems() {
        function lock(item, cb) {
            canvas.put(`/api/v1/courses/${courseID}/blueprint_templates/default/restrict_item`, item, (itemErr) => {
                if (itemErr) {
                    console.error(chalk.red(itemErr.stack));
                } else {
                    lockCount++;
                }

                cb(null);
            });
        }

        asyncLib.eachLimit(itemsToLock, 20, lock, (err) => {
            if (err) {
                /* this should never be called */
                console.error(chalk.red(err.stack));
            }
            console.log(`Locked ${lockCount} item(s)`);
            callback(null, course);
        });
    }


    /* function getModuleItems(canvasModule, eachCB) {
        canvas.getModuleItems(courseID, canvasModule.id, (err, moduleItems) => {
            if (err) {
                eachCB(err);
                return;
            }

            var tempObj;
            moduleItems.forEach(moduleItem => {
                tempObj = {};

                if (moduleItem.type === 'Page') {
                    tempObj = {
                        'content_type': 'wiki_page',
                        'content_id': moduleItem.id,
                        'restricted': true
                    };
                    itemsToLock.push(tempObj);
                }
            });
            eachCB(null);
        });
    } */


    /* function getModules() {
        canvas.getModules(courseID, (moduleErr, modules) => {
            if (moduleErr) {
                console.log('Error getting modules');
                console.error(chalk.red(moduleErr.stack));
                lockItems();
                return;
            }

            var modulesToKeep = [/student\s*resources/gi, /instructor\s*resources/gi];
            var importantModules = modules.filter(canvasModule => {
                return modulesToKeep.some(regex => regex.test(canvasModule.name));
            });

            asyncLib.eachLimit(importantModules, 2, getModuleItems, (err) => {
                if (err) {
                    console.log('Error getting module items');
                    console.error(chalk.red(err.stack));
                }
                lockItems();
            });
        });
    } */


    function getFiles() {
        canvas.getFiles(courseID, (fileErr, files) => {
            if (fileErr) {
                console.log('Error getting files');
                console.error(chalk.red(fileErr.stack));
            } else {
                files = files.map(file => {
                    return {
                        'content_type': 'attachment',
                        'content_id': file.id,
                        'restricted': true
                    };
                });
                itemsToLock = itemsToLock.concat(files);
            }
            lockItems();

        });
    }

    getFiles();
};


/* work({
    course_id: 11123,
    blueprint_course_id: 11122 // the master. idk why
}, (err, course) => {
    if (err) console.error(chalk.red(err.stack));
    else console.log('Done! :D');
}); */
const path = require('path');

const main = require('./main.js');

const unlinkBP = require('./unlinkBP.js');
const setSettings = require('./setSettings.js');
const enableBP = require('./enableBP.js');
const copyGroups = require('./copyGroups.js');
const latePolicy = require('./latePolicy.js');
const lockItems = require('./lockItems.js');
const publishCourse = require('./publishCourse.js');
const setRestrictions = require('./setRestrictions.js');

const csvPath = path.resolve('.', 'Spring Online Course Copy - Sections2');

var bpTasks = [
    unlinkBP,
    enableBP,
    setRestrictions,
    setSettings,
    copyGroups,
    latePolicy,
    lockItems,
];

var sectionTasks = [
    setSettings,
    copyGroups,
    latePolicy,
    publishCourse,
];

// main(bpTasks);
main(sectionTasks, csvPath);
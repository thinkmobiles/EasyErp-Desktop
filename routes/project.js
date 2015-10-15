
var express = require('express');
var router = express.Router();
var ProjectHandler = require('../handlers/project');

module.exports = function (models) {
    var handler = new ProjectHandler(models);

    router.post('/updateAllProjects', handler.updateAllProjects);
    router.get('/getProjectPMForDashboard', handler.getProjectPMForDashboard);
    //router.get('/getForDashboard', handler.getForDashboard);
    router.get('/getForWtrack', handler.getForWtrack);
    router.get('/getFilterValues', handler.getFilterValues);

    router.post('/exportToXlsxFullData',handler.exportToXlsxFullData);
    router.post('/exportToCsvFullData',handler.exportToCsvFullData);

    return router;
};
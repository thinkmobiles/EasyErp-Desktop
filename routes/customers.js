var express = require('express');
var router = express.Router();
var CustomerHandler = require('../handlers/customer');

module.exports = function (models) {
    var handler = new CustomerHandler(models);

    function checkAuth(req, res, next){
        var error;

        if(!req.session || !req.session.loggedIn){
            error = new Error("Not Authorized");
            error.status = 401;

            return next(error);
        }
        next();
    }

    router.get('/', checkAuth, handler.getAll);
    router.post('/exportToXlsx',handler.exportToXlsx);
    router.post('/exportToCsv',handler.exportToCsv);
    router.get('/:id', checkAuth, handler.getById);
    router.post('/exportToXlsxFullData',handler.exportToXlsxFullData);
    router.post('/exportToCsvFullData',handler.exportToCsvFullData);

    //router.post('/', handler.create);

    return router;
};
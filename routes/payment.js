
var express = require('express');
var router = express.Router();
var PaymentHandler = require('../handlers/payment');

module.exports = function (models, event) {
    var handler = new PaymentHandler(models, event);

    router.get('/:id', handler.getById);
    router.get('/getForProject', handler.getForProject);
    router.get('/:byType/totalCollectionLength', handler.totalCollectionLength);
    router.get('/:byType/:viewType', handler.getForView);
    router.post('/', handler.create);
    router.post('/supplier', handler.createPayOut);
    router.post('/salary', handler.salaryPayOut);
    router.delete('/:id', handler.remove);
    router.patch('/:byType', handler.putchBulk);

    return router;
};

/*

* */
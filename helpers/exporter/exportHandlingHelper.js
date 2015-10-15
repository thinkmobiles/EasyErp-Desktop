var csv = require('fast-csv');
var fs = require('fs');
var arrayToXlsx = require('../exporter/arrayToXlsx');

var createProjection = function (map, options) {
    var project = {};
    var properties = options.properties;
    var arrayToAdd = options.putHeadersTo;
    var addHeaders = !!arrayToAdd;
    var value;

    for (var key in map) {
        value = map[key];
        if (addHeaders) {
            arrayToAdd.push(value);
        }
        //todo remove some properties from map according to {properties}
        project[value] = '$' + key;
    }
    return project;
};

/**
 * @param {Object} handler - object to insert exportToCsv method
 * @param {Function) getModel - function(req) that will return specified model
 * @param {Object} map - object with all model properties and their names
 * @param {string fileName - name that will be used for export file, without extension
 */
var addExportToCsvFunctionToHandler = function (handler, getModel, map) {
    handler['exportToCsv'] = function (req, res, next) {
        var Model = getModel(req);
        var body = req.body;

        var propertiesToDisplay = body.properties;
        var itemIdsToDisplay = body.items;

        var type = body.type;
        var fileName=body.fileName;

        var project = createProjection(map, {properties: propertiesToDisplay});
        var nameOfFile = fileName ? fileName : type ? type : 'data';

        var match;

        itemIdsToDisplay = itemIdsToDisplay.objectID();
        match = {_id: {$in: itemIdsToDisplay}};

        if (type) {
            match.type = type;
        }

        Model.aggregate(
            {$match: match},
            {$project: project},
            function (err, response) {
                var writableStream;

                if (err) {
                    return next(err);
                }

                writableStream = fs.createWriteStream(nameOfFile + ".csv");

                writableStream.on('finish', function () {
                    res.status(200).send({url: '/download?path=' + nameOfFile + '.csv'});
                });

                csv
                    .write(response, {headers: Object.keys(project)})
                    .pipe(writableStream);

            });
    }
};

/**
 * @param {Object} handler - object to insert exportToXlsx method
 * @param {Function) getModel - function(req) that will return specified model
 * @param {Object} map - object with all model properties and their names
 * @param {string} fileName - name that will be used for export file, without extension
 */
var addExportToXlsxFunctionToHandler = function (handler, getModel, map) {
    handler['exportToXlsx'] = function (req, res, next) {
        var Model = getModel(req);
        var body = req.body;

        var propertiesToDisplay = body.properties;
        var itemIdsToDisplay = body.items;

        var type = body.type;
        var fileName=body.fileName;
        var headersArray = [];

        var project = createProjection(map, {putHeadersTo: headersArray});
        var nameOfFile = fileName ? fileName : type ? type : 'data';
        var match;

        itemIdsToDisplay = itemIdsToDisplay.objectID();
        match = {_id: {$in: itemIdsToDisplay}};

        if (type) {
            match.type = type;
        }

        Model.aggregate({$match: match}, {$project: project}, function (err, response) {

            if (err) {
                return next(err);
            }
            //todo map objectId to string

            arrayToXlsx.writeFile(nameOfFile + '.xlsx', response, {
                sheetName : "data",
                headers   : headersArray,
                attributes: headersArray
            });

            res.status(200).send({url: '/download?path=' + nameOfFile + '.xlsx'});

        });
    }
};

exports.addExportToCsvFunctionToHandler = addExportToCsvFunctionToHandler;
exports.addExportToXlsxFunctionToHandler = addExportToXlsxFunctionToHandler;

/**
 *
 * Inserts export methods to specific handler object
 * @param {Object} handler - object to insert exportToXlsx and exportToCsv methods
 * @param {Function) getModel - function(req) that will return specified model
 * @param {Object} map - object with all model properties and their names
 * @param {string} [fileName] - name that will be used for export file, without extension. Otherwise will be used "type" from request query, if exist or "data"
 */
exports.addExportFunctionsToHandler = function (handler, getModel, map) {
    addExportToCsvFunctionToHandler(handler, getModel, map);
    addExportToXlsxFunctionToHandler(handler, getModel, map);
};
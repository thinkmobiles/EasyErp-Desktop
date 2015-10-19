var mongoose = require('mongoose');
var Products = function (models) {
    var access = require("../Modules/additions/access.js")(models);
    var ProductSchema = mongoose.Schemas['Products'];
    var DepartmentSchema = mongoose.Schemas['Department'];
    var objectId = mongoose.Types.ObjectId;
    var async = require('async');
    var exportFullMap = require('../helpers/exporter/exportMapper');
    var _ = require('lodash');
    var underscore = require('../node_modules/underscore');
    var unfolder = require('../helpers/unfolder');
    var csv = require('fast-csv');
    var arrayToXlsx = require('../helpers/exporter/arrayToXlsx');
    var fs = require("fs");

    var exportHandlingHelper = require('../helpers/exporter/exportHandlingHelper');
    var exportMap = require('../helpers/csvMap').Products.aliases;

    exportHandlingHelper.addExportFunctionsToHandler(this, function (req) {
        return models.get(req.session.lastDb, 'Product', ProductSchema)
    }, exportMap);

    this.create = function (req, res, next) {
        var Product = models.get(req.session.lastDb, 'Product', ProductSchema);
        var body = req.body;
        var product = new Product(body);

        if (req.session.uId) {
            product.createdBy.user = req.session.uId;
            product.editedBy.user = req.session.uId;
        }

        product.info.salePrice = parseFloat(product.info.salePrice).toFixed(2);

        product.save(function (err, product) {
            if (err) {
                return next(err);
            }
            res.status(200).send({success: product});
        });
    };

    function updateOnlySelectedFields(req, res, next, id, data) {
        var Product = models.get(req.session.lastDb, 'Product', ProductSchema);

        Product.findByIdAndUpdate(id, {$set: data},{new:true}, function (err, product) {
            if (err) {
                next(err);
            } else {
                res.status(200).send({success: 'Product updated', result: product});
            }
        });

    };

    this.productsUpdateOnlySelectedFields = function (req, res, next) {
        var id = req.params._id;
        var data = req.body;

        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 58, function (access) {
                if (access) {
                    data.editedBy = {
                        user: req.session.uId,
                        date: new Date().toISOString()
                    };
                    updateOnlySelectedFields(req, res, next, id, data);
                } else {
                    res.status(403).send();
                }
            });
        } else {
            res.status(401).send();
        }
    }

    this.getProductsImages = function (req, res, next) {
        var data = {};
        data.ids = req.query.ids || [];

        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 58, function (access) {
                if (access) {
                    getProductImages(req, res, next, data);
                } else {
                    res.status(403).send();
                }
            });

        } else {
            res.status(401).send();
        }
    };

    function getProductImages(req, res, next, data) {
        var query = models.get(req.session.lastDb, "Products", ProductSchema).find({});
        query.where('_id').in(data.ids).
            select('_id imageSrc').
            exec(function (error, response) {
                if (error) {
                    next(error);
                } else res.status(200).send({data: response});
            });

    };

    this.uploadProductFiles = function (req, res, next) {
        var os = require("os");
        var osType = (os.type().split('_')[0]);
        var dir;
        switch (osType) {
            case "Windows":
            {
                dir = __dirname + "\\uploads\\";
            }
                break;
            case "Linux":
            {
                dir = __dirname + "\/uploads\/";
            }
        }
        fs.readdir(dir, function (err, files) {
            if (err) {
                fs.mkdir(dir, function (errr) {
                    if (!errr)
                        dir += req.headers.id;
                    fs.mkdir(dir, function (errr) {
                        if (!errr)
                            uploadFileArray(req, res, function (files) {
                                uploadProductFile(req, res, next, req.headers.id, files);
                            });
                    });
                });
            } else {
                dir += req.headers.id;
                fs.readdir(dir, function (err, files) {
                    if (err) {
                        fs.mkdir(dir, function (errr) {
                            if (!errr)
                                uploadFileArray(req, res, function (files) {
                                    uploadProductFile(req, res, next, req.headers.id, files);
                                });
                        });
                    } else {
                        uploadFileArray(req, res, function (files) {
                            uploadProductFile(req, res, next, req.headers.id, files);
                        });
                    }
                });
            }
        });
    };

    function addAtach(req, res, next, _id, files) {//to be deleted
        models.get(req.session.lastDb, "Product", ProductSchema).findByIdAndUpdate(_id, {$push: {attachments: {$each: files}}}, {upsert: true}, function (err, result) {
            if (err) {
                next(err);
            } else {
                res.status(200).send({success: 'Products updated success', data: result});
            }
        });
    }// end update

    function uploadProductFile(req, res, next, id, files) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 58, function (access) {
                if (access) {
                    addAtach(req, res, next, id, files);
                } else {
                    res.status(403).send();
                }
            });
        } else {
            res.status(401).send();
        }
    };

    function remove(req, res, next, id) {
        models.get(req.session.lastDb, "Products", ProductSchema).remove({_id: id}, function (err, product) {
            if (err) {
                return next(err);
            } else {
                res.status(200).send({success: product});
            }
        });
    };

    this.removeProduct = function (req, res, next) {
        var id = req.params._id;
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getDeleteAccess(req, req.session.uId, 58, function (access) {
                if (access) {
                    remove(req, res, next, id);
                } else {
                    res.status(403).send();
                }
            });
        } else {
            res.status(401).send();
        }
    };

    this.getAll = function (req, res, next) {
        var Product = models.get(req.session.lastDb, 'Product', ProductSchema);
        var queryObject = {};
        var query = req.query;

        //if (query && query.canBeSold) {
        //    queryObject.canBeSold = true;
        //} else {
        //    queryObject.canBePurchased = true;
        //}

        Product.find(queryObject, function (err, products) {
            if (err) {
                return next(err);
            }
            res.status(200).send({success: products});
        });
    };

    function caseFilter(filter) {
        var condition;
        var resArray = [];
        var filtrElement = {};
        var key;

        for (var filterName in filter){
            condition = filter[filterName]['value'];
            key = filter[filterName]['key'];

            switch (filterName) {
                case 'letter':
                    filtrElement['name'] = new RegExp('^[' + filter.letter.toLowerCase() + filter.letter.toUpperCase() + '].*');
                    resArray.push(filtrElement);
                    break;
                case 'name':
                    filtrElement[key] = {$in: condition.objectID()};
                    resArray.push(filtrElement);
                    break;
                case 'productType':
                    filtrElement[key] = {$in: condition};
                    resArray.push(filtrElement);
                    break;
                case 'canBeSold':
                    condition = ConvertType(condition, 'boolean');
                    filtrElement[key] = {$in: condition};
                    resArray.push(filtrElement);
                    break;
                case 'canBeExpensed':
                    condition = ConvertType(condition, 'boolean');
                    filtrElement[key] = {$in: condition};
                    resArray.push(filtrElement);
                    break;
                case 'canBePurchased':
                    condition = ConvertType(condition, 'boolean');
                    filtrElement[key] = {$in: condition};
                    resArray.push(filtrElement);
                    break;
            }
        };

        return resArray;
    };

    function ConvertType(array, type) {
        var result = [];
        if (type === 'integer') {
            for (var i = array.length - 1; i >= 0; i--) {
                result[i] = parseInt(array[i]);
            }
        } else if (type === 'boolean') {
            for (var i = array.length - 1; i >= 0; i--) {
                if (array[i] === 'true') {
                    result[i] = true;
                } else if (array[i] === 'false') {
                    result[i] = false;
                } else {
                    result[i] = null;
                }
            }
        }
        return result;
    };

    function getProductsFilter(req, res, next) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 58, function (access) {
                if (access) {
                    var Product = models.get(req.session.lastDb, 'Product', ProductSchema);
                    var query = req.query;
                    var optionsObject = {};
                    var sort = {};
                    var count = query.count ? query.count : 100;
                    var page = req.query.page;
                    var skip = (page - 1) > 0 ? (page - 1) * count : 0;

                    var departmentSearcher;
                    var contentIdsSearcher;
                    var contentSearcher;
                    var waterfallTasks;

                    if (query && query.sort) {
                        sort = query.sort;
                    } else {
                        sort = {"name": 1};
                    }

                    if (query.filter && typeof query.filter === 'object') {
                        if (query.filter.condition === 'or') {
                            optionsObject['$or'] = caseFilter(query.filter);
                        } else {
                            optionsObject['$and'] = caseFilter(query.filter);
                        }
                    }

                    departmentSearcher = function (waterfallCallback) {
                        models.get(req.session.lastDb, "Department", DepartmentSchema).aggregate(
                            {
                                $match: {
                                    users: objectId(req.session.uId)
                                }
                            }, {
                                $project: {
                                    _id: 1
                                }
                            },

                            waterfallCallback);
                    };

                    contentIdsSearcher = function (deps, waterfallCallback) {
                        var arrOfObjectId = deps.objectID();

                        models.get(req.session.lastDb, "Product", ProductSchema).aggregate(
                            {
                                $match: {
                                    $and: [
                                        optionsObject,
                                        {
                                            $or: [
                                                {
                                                    $or: [
                                                        {
                                                            $and: [
                                                                {whoCanRW: 'group'},
                                                                {'groups.users': objectId(req.session.uId)}
                                                            ]
                                                        },
                                                        {
                                                            $and: [
                                                                {whoCanRW: 'group'},
                                                                {'groups.group': {$in: arrOfObjectId}}
                                                            ]
                                                        }
                                                    ]
                                                },
                                                {
                                                    $and: [
                                                        {whoCanRW: 'owner'},
                                                        {'groups.owner': objectId(req.session.uId)}
                                                    ]
                                                },
                                                {whoCanRW: "everyOne"}
                                            ]
                                        }
                                    ]
                                }
                            },
                            {
                                $project: {
                                    _id: 1
                                }
                            },
                            waterfallCallback
                        );
                    };

                    contentSearcher = function (productsIds, waterfallCallback) {
                        var query;
                        optionsObject._id = {$in: productsIds};

                        query = Product.find(optionsObject).sort(sort);
                        query.exec(waterfallCallback);
                    };

                    waterfallTasks = [departmentSearcher, contentIdsSearcher, contentSearcher];

                    async.waterfall(waterfallTasks, function (err, products) {
                        if (err) {
                            return next(err);
                        }
                        res.status(200).send({success: products});

                    });
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    };

    function getProductsById(req, res, next) {
        var id = req.query.id;
        var Product = models.get(req.session.lastDb, "Products", ProductSchema);

        var departmentSearcher;
        var contentIdsSearcher;
        var contentSearcher;
        var waterfallTasks;

        var contentType = req.query.contentType;

        departmentSearcher = function (waterfallCallback) {
            models.get(req.session.lastDb, "Department", DepartmentSchema).aggregate(
                {
                    $match: {
                        users: objectId(req.session.uId)
                    }
                }, {
                    $project: {
                        _id: 1
                    }
                },

                waterfallCallback);
        };

        contentIdsSearcher = function (deps, waterfallCallback) {
            var arrOfObjectId = deps.objectID();

            models.get(req.session.lastDb, "Product", ProductSchema).aggregate(
                {
                    $match: {
                        $and: [
                            /*optionsObject,*/
                            {
                                $or: [
                                    {
                                        $or: [
                                            {
                                                $and: [
                                                    {whoCanRW: 'group'},
                                                    {'groups.users': objectId(req.session.uId)}
                                                ]
                                            },
                                            {
                                                $and: [
                                                    {whoCanRW: 'group'},
                                                    {'groups.group': {$in: arrOfObjectId}}
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        $and: [
                                            {whoCanRW: 'owner'},
                                            {'groups.owner': objectId(req.session.uId)}
                                        ]
                                    },
                                    {whoCanRW: "everyOne"}
                                ]
                            }
                        ]
                    }
                },
                {
                    $project: {
                        _id: 1
                    }
                },
                waterfallCallback
            );
        };

        contentSearcher = function (productsIds, waterfallCallback) {
            var query;

            query = Product.findById(id);

            query.populate('info.productType', 'name _id').
                populate('department', '_id departmentName').
                populate('createdBy.user').
                populate('editedBy.user').
                populate('groups.users').
                populate('groups.group').
                populate('groups.owner', '_id login');

            query.exec(waterfallCallback);
        };

        waterfallTasks = [departmentSearcher, contentIdsSearcher, contentSearcher];

        async.waterfall(waterfallTasks, function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send(result);
        });
    };

    this.getForView = function (req, res, next) {
        var viewType = req.params.viewType;

        switch (viewType) {
            case "list":
            case "thumbnails":
                getProductsFilter(req, res, next);
                break;
            case "form":
                getProductsById(req, res, next);
                break;
        }
    };

    function getForDd(req, response, next) {
        var ProductTypesSchema = mongoose.Schemas['productTypes'];

        var res = {};
        res['data'] = [];

        var query = models.get(req.session.lastDb, 'productTypes', ProductTypesSchema).find();
        query.select('_id name ');
        query.sort({'name': 1});
        query.exec(function (err, result) {
            if (err) {
                next(err);
            } else {
                res['data'] = result;
                response.status(200).send(res);
            }
        });
    };

    this.getProductsTypeForDd = function (req, res, next) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            getForDd(req, res, next);
        } else {
            res.status(401).send();
        }
    };

    function getProductsAlphabet(req, response, next) {
        var options = req.query;
        var queryObject = {};
        var query;

        query = models.get(req.session.lastDb, "Product", ProductSchema).aggregate([{$match: queryObject}, {$project: {later: {$substr: ["$name", 0, 1]}}}, {$group: {_id: "$later"}}]);
        query.exec(function (err, result) {
            if (err) {
                next(err)
            } else {
                var res = {};
                res['data'] = result;
                response.status(200).send(res);
            }
        });
    };

    this.getProductsAlphabet = function (req, res, next) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            getProductsAlphabet(req, res, next);
        } else {
            res.send(401);
        }
    };

    this.totalCollectionLength = function (req, res, next) {
        var result = {};
        var data = req.query;

        result['showMore'] = false;

        var optionsObject = {};

        var Product = models.get(req.session.lastDb, 'Product', ProductSchema);
        var departmentSearcher;
        var contentIdsSearcher;

        var contentSearcher;
        var waterfallTasks;

        if (data.filter && typeof data.filter === 'object') {
            if (data.filter.condition === 'or') {
                optionsObject['$or'] = caseFilter(data.filter);
            } else {
                optionsObject['$and'] = caseFilter(data.filter);
            }
        }

        departmentSearcher = function (waterfallCallback) {
            models.get(req.session.lastDb, "Department", DepartmentSchema).aggregate(
                {
                    $match: {
                        users: objectId(req.session.uId)
                    }
                }, {
                    $project: {
                        _id: 1
                    }
                },

                waterfallCallback);
        };

        contentIdsSearcher = function (deps, waterfallCallback) {
            var arrOfObjectId = deps.objectID();

            models.get(req.session.lastDb, "Product", ProductSchema).aggregate(
                {
                    $match: {
                        $and: [
                            optionsObject,
                            {
                                $or: [
                                    {
                                        $or: [
                                            {
                                                $and: [
                                                    {whoCanRW: 'group'},
                                                    {'groups.users': objectId(req.session.uId)}
                                                ]
                                            },
                                            {
                                                $and: [
                                                    {whoCanRW: 'group'},
                                                    {'groups.group': {$in: arrOfObjectId}}
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        $and: [
                                            {whoCanRW: 'owner'},
                                            {'groups.owner': objectId(req.session.uId)}
                                        ]
                                    },
                                    {whoCanRW: "everyOne"}
                                ]
                            }
                        ]
                    }
                },
                {
                    $project: {
                        _id: 1
                    }
                },
                waterfallCallback
            );
        };

        contentSearcher = function (productsIds, waterfallCallback) {
            var query;
            optionsObject._id = {$in: productsIds};

            query = Product.find(optionsObject);
            query.exec(waterfallCallback);
        };

        waterfallTasks = [departmentSearcher, contentIdsSearcher, contentSearcher];

        async.waterfall(waterfallTasks, function (err, products) {
            if (err) {
                return next(err);
            }
            if (data.currentNumber && data.currentNumber < products.length) {
                result['showMore'] = true;
            }
            result['count'] = products.length;
            res.status(200).send(result);

        });
    };

    this.exportToCsvFullData = function (req, res, next) {
        var Product = models.get(req.session.lastDb, 'Product', ProductSchema);
        var body = req.body;
        var itemIdsToDisplay = body.items;
        var query = itemIdsToDisplay ? {'_id': {$in: itemIdsToDisplay}} : {};
        var fileUnic = new Date().toISOString();
        var nameOfFile = "Product_" + fileUnic + ".csv";

        Product.find(query)
            .populate('wTrack')
            .populate('accounting.category._id:')
            .populate('info.productType')
            .populate('workflow')
            .populate('groups.owner')
            .populate('groups.users')
            .populate('groups.group')
            .populate('createdBy.user')
            .populate('editedBy.user')


            .exec(function (err, result) {
                if (err) {
                    next(err);
                    return;
                }
                unfolder(result, exportFullMap.Product.map, function (err, result) {
                    var writableStream;

                    if (err) {
                        next(err);
                    }
                    writableStream = fs.createWriteStream(nameOfFile);
                    writableStream.on('finish', function () {
                        res.status(200).send({url: '/download?path=' + nameOfFile});
                    });
                    csv
                        .write(result, {headers: getHeaders(exportFullMap.Product.map)})
                        .pipe(writableStream);
                });

            });

    };

    this.exportToXlsxFullData = function (req, res, next) {
        var Product = models.get(req.session.lastDb, 'Product', ProductSchema);
        var body = req.body;
        var itemIdsToDisplay = body.items;
        var query = itemIdsToDisplay ? {'_id': {$in: itemIdsToDisplay}} : {};
        var fileUnic = new Date().toISOString();
        var nameOfFile = "Product_" + fileUnic + ".xlsx";
        var headersArray = getHeaders(exportFullMap.Product.map);

        Product.find(query)
            .populate('wTrack')
            .populate('accounting.category._id:')
            .populate('info.productType')
            .populate('workflow')
            .populate('groups.owner')
            .populate('groups.users')
            .populate('groups.group')
            .populate('createdBy.user')
            .populate('editedBy.user')
            .exec(function (err, result) {
                if (err) {
                    return next(err);
                }
                unfolder(result, exportFullMap.Product.map, function (err, result) {

                    if (err) {
                        return next(err);
                    }
                    arrayToXlsx.writeFile(nameOfFile, result, {
                        sheetName : "data",
                        headers   : headersArray,
                        attributes: headersArray
                    });
                    res.status(200).send({url: '/download?path=' + nameOfFile});

                });

            });

    };

    function getHeaders(maps) {
        var headers = [];

        for (var i = 0; i < maps.length; i++) {
            headers.push(maps[i].key);
        }
        return headers;
    }

};

module.exports = Products;
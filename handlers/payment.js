var mongoose = require('mongoose');
var async = require('async');
var WorkflowHandler = require('./workflow');
var _ = require('lodash');

var CONSTANTS = require('../constants/modules');
var MAINCONSTANTS = require('../constants/mainConstants');

var Payment = function (models, event) {
    "use strict";
    var access = require("../Modules/additions/access.js")(models);
    var composeExpensesAndCache = require('../helpers/expenses')(models);

    var rewriteAccess = require('../helpers/rewriteAccess');
    var EmployeeSchema = mongoose.Schemas['Employee'];
    var wTrackPayOutSchema = mongoose.Schemas['wTrackPayOut'];
    var PaymentSchema = mongoose.Schemas['Payment'];
    var salaryPaymentSchema = mongoose.Schemas['salaryPayment'];
    var payrollSchema = mongoose.Schemas['PayRoll'];
    var JobsSchema = mongoose.Schemas['jobs'];
    var wTrackInvoiceSchema = mongoose.Schemas['wTrackInvoice'];
    var payRollInvoiceSchema = mongoose.Schemas['payRollInvoice'];
    var InvoiceSchema = mongoose.Schemas['Invoice'];
    var DepartmentSchema = mongoose.Schemas['Department'];
    var wTrackSchema = mongoose.Schemas['wTrack'];

    var objectId = mongoose.Types.ObjectId;
    var waterfallTasks;

    function checkDb(db) {
        var validDbs = ["weTrack", "production", "development"];

        return validDbs.indexOf(db) !== -1;
    }

    function returnModuleId(req) {
        var body = req.body;
        var moduleId;
        var type = req.params.byType;

       // moduleId = !!body.forSales ? 61 : !!body.salary ? 79 : 60;

        moduleId = (type === 'customer') ? 61 : (type === 'supplier') ? 60 : 79;

        return moduleId;
    }

    function returnModel(req, options) {
        var moduleId = returnModuleId(req);
        var Payment;

        options = options || {};

        if (options.isWtrack) {
            if (moduleId === 61) {
                Payment = models.get(req.session.lastDb, 'Payment', PaymentSchema);
            } else if (moduleId === 79) {
                Payment = models.get(req.session.lastDb, 'salaryPayment', salaryPaymentSchema);
            } else if (moduleId === 60) {
                Payment = models.get(req.session.lastDb, 'wTrackPayOut', wTrackPayOutSchema);
            }
        } else {
            Payment = models.get(req.session.lastDb, 'Payment', PaymentSchema);
        }

        return Payment;
    };

    function caseFilter(filter) {
        var condition;
        var resArray = [];
        var filtrElement = {};
        var key;

        for (var filterName in filter) {
            condition = filter[filterName]['value'] ? filter[filterName]['value'] : [];
            key = filter[filterName]['key'];

            switch (filterName) {
                case 'assigned':
                    filtrElement[key] = {$in: condition.objectID()};
                    resArray.push(filtrElement);
                    break;
                case 'name':
                    filtrElement[key] = {$in: condition.objectID()};
                    resArray.push(filtrElement);
                    break;
                case 'supplier':
                    filtrElement[key] = {$in: condition.objectID()};
                    resArray.push(filtrElement);
                    break;
                case 'paymentMethod':
                    filtrElement[key] = {$in: condition.objectID()};
                    resArray.push(filtrElement);
                    break;
                case 'workflow':
                    filtrElement[key] = {$in: condition};
                    resArray.push(filtrElement);
                    break;
                case 'forSale':
                    condition = ConvertType(condition, 'boolean');
                    filtrElement[key] = condition;
                    resArray.push(filtrElement);
                    break;
                case 'paymentRef':
                    filtrElement[key] = {$in: condition};
                    resArray.push(filtrElement);
                    break;
                case 'year':
                    ConvertType(condition, 'integer');
                    filtrElement[key] = {$in: condition};
                    resArray.push(filtrElement);
                    break;
                case 'month':
                    ConvertType(condition, 'integer');
                    filtrElement[key] = {$in: condition};
                    resArray.push(filtrElement);
                    break;
            }
        }

        return resArray;
    }

    function ConvertType(array, type) {
        if (type === 'integer') {
            for (var i = array.length - 1; i >= 0; i--) {
                array[i] = parseInt(array[i]);
            }
        } else if (type === 'boolean') {
            for (var i = array.length - 1; i >= 0; i--) {
                if (array[i] === 'true') {
                    array[i] = true;
                } else if (array[i] === 'false') {
                    array[i] = false;
                } else {
                    array[i] = null;
                }
            }
        }
    }

    function getPaymentFilter(req, res, next, options) {
        var isWtrack = checkDb(req.session.lastDb);
        var moduleId = returnModuleId(req);
        var data = req.query;
        var filter = data.filter;
        var forSale = options ? !!options.forSale : false;
        var bonus = options ? !!options.bonus : false;
        var salary = options ? !!options.salary : false;
        var Payment;

        options.isWtrack = isWtrack;
        Payment = returnModel(req, options);

        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, moduleId, function (access) {
                if (access) {
                    var Employee = models.get(req.session.lastDb, 'Employees', EmployeeSchema);

                    var optionsObject = {}; //{forSale: forSale};
                    var sort = {};
                    var count = req.query.count ? req.query.count : 100;
                    var page = req.query.page;
                    var skip = (page - 1) > 0 ? (page - 1) * count : 0;

                    var departmentSearcher;
                    var contentIdsSearcher;
                    var contentSearcher;
                    var waterfallTasks;

                    if (req.query.sort) {
                        sort = req.query.sort;
                    } else {
                        sort = {"date": -1};
                    }

                    if (bonus) {
                        optionsObject.bonus = bonus;
                    }

                    optionsObject.$and = [];

                    if (filter && typeof filter === 'object') {
                        if (filter.condition === 'or') {
                            optionsObject['$or'] = caseFilter(filter);
                        } else {
                            optionsObject['$and'] = caseFilter(filter);
                        }
                    }

                    if (!salary) {
                        optionsObject.$and.push({forSale: forSale});
                    } else {
                        optionsObject.$and.push({isExpense: true});
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
                        var everyOne = rewriteAccess.everyOne();
                        var owner = rewriteAccess.owner(req.session.uId);
                        var group = rewriteAccess.group(req.session.uId, deps);
                        var whoCanRw = [everyOne, owner, group];
                        var matchQuery = {
                            $and: [
                                optionsObject,
                                {
                                    $or: whoCanRw
                                }
                            ]
                        };

                        Payment.aggregate(
                            {
                                $match: matchQuery
                            },
                            {
                                $project: {
                                    _id: 1
                                }
                            },
                            waterfallCallback
                        );
                    };

                    contentSearcher = function (paymentsIds, waterfallCallback) {
                        var query;

                        optionsObject._id = {$in: paymentsIds};

                        query = Payment.find(optionsObject).limit(count).skip(skip).sort(sort);

                        /* query
                         .populate('invoice._id', '_id name');
                         /!*.populate('paymentMethod', '_id name');*!/*/

                        query.exec(function (err, result) {
                            if (err) {
                                return waterfallCallback(err);
                            }

                            /*Employee.populate(result, {
                             path   : 'invoice.salesPerson',
                             select : '_id name',
                             options: {lean: true}
                             }, function () {*/
                            waterfallCallback(null, result);
                            /*});*/
                        });
                    };

                    waterfallTasks = [departmentSearcher, contentIdsSearcher, contentSearcher];

                    async.waterfall(waterfallTasks, function (err, result) {
                        if (err) {
                            return next(err);
                        }
                        res.status(200).send(result);
                    });
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    }

    this.getById = function (req, res, next) {
        var id = req.params.id;
        var Payment;
        var moduleId = returnModuleId(req);

        Payment = models.get(req.session.lastDb, 'Payment', PaymentSchema);

        access.getReadAccess(req, req.session.uId, moduleId, function (access) {
            if (access) {

                Payment.findById(id, function (err, payment) {
                    if (err) {
                        return next(err);
                    }
                    res.status(200).send({success: payment});
                });
            } else {
                res.status(403).send();
            }
        });
    };

    this.getAll = function (req, res, next) {
        //this temporary unused
        var Payment;

        Payment = models.get(req.session.lastDb, 'Payment', PaymentSchema);

        var query = {};

        Payment.find(query, function (err, payments) {
            if (err) {
                return next(err);
            }
            res.status(200).send({success: payments});
        });
    };

    this.getForView = function (req, res, next) {
        var viewType = req.params.viewType;
        var type = req.params.byType;
        var forSale = type === 'customers';
        var bonus = type === 'supplier';
        var salary = type === 'salary';
        var options = {
            forSale: forSale,
            bonus  : bonus,
            salary : salary
        };

        switch (viewType) {
            case "list":
                getPaymentFilter(req, res, next, options);
                break;
        }
    };

    this.createPayOut = function (req, res, next) {
        var body = req.body;

        var moduleId = returnModuleId(req);
        var isWtrack = checkDb(req.session.lastDb);

        var Payment;

        if (isWtrack) {
            Payment = models.get(req.session.lastDb, 'wTrackPayOut', wTrackPayOutSchema);
        } else {
            Payment = models.get(req.session.lastDb, 'Payment', PaymentSchema);
        }

        access.getEditWritAccess(req, req.session.uId, moduleId, function (access) {
            if (access) {
                var payment = new Payment(body);

                payment.save(function (err, payment) {
                    if (err) {
                        return next(err);
                    }

                    res.status(200).send(payment);
                });

            } else {
                res.status(403).send();
            }
        });

    };

    function payrollExpensUpdater(db, _payment, mulParram, cb) {
        var Payroll = models.get(db, 'PayRoll', payrollSchema);
        var id = _payment.paymentRef ? _payment.paymentRef : _payment.product;
        var paid = _payment.paidAmount ? _payment.paidAmount : _payment.paid;

        paid = paid * mulParram;

        Payroll.findByIdAndUpdate(id, {
            $inc: {
                diff: paid,
                paid: paid
            }
        }, cb);
    }

    this.salaryPayOut = function (req, res, next) {
        var db = req.session.lastDb;
        var body = req.body;
        //var salaryPayment = body[0];
        var moduleId = 66;
        var Payment = models.get(req.session.lastDb, 'salaryPayment', salaryPaymentSchema);
        var Invoice = models.get(req.session.lastDb, 'payRollInvoice', payRollInvoiceSchema);

        access.getEditWritAccess(req, req.session.uId, moduleId, function (access) {
            if (access) {
                var mapBody = function (cb) {
                    var totalAmount = 0;
                    var suppliers = [];
                    var products = [];
                    var resultObject = {};

                    _.map(body, function (_payment) {
                        var supplierObject = _payment.supplier;
                        var productObject = {};

                        productObject.product = _payment.paymentRef;
                        productObject.paid = _payment.paidAmount;
                        productObject.diff = _payment.diff;

                        supplierObject.paidAmount = _payment.paidAmount;
                        supplierObject.differenceAmount = _payment.differenceAmount;

                        totalAmount += _payment.paidAmount;
                        suppliers.push(supplierObject);
                        products.push(productObject);

                        return true;
                    })

                    resultObject.suppliers = suppliers;
                    resultObject.products = products;
                    resultObject.totalAmount = totalAmount;

                    cb(null, resultObject);
                };

                var createInvoice = function (params, cb) {
                    var invoice = new Invoice({products: params.products});

                    invoice.save(function (err, result) {
                        if (err) {
                            return cb(err);
                        }

                        params.invoice = result;
                        cb(null, params);
                    });
                };

                var createPayment = function (params, cb) {
                    var paymentObject = _.clone(body[0]);
                    var payment;

                    paymentObject.invoice = {};
                    paymentObject.invoice._id = params.invoice.get('_id');

                    paymentObject.supplier = params.suppliers;
                    paymentObject.paidAmount = params.totalAmount;

                    payment = new Payment(paymentObject);
                    payment.save(function (err, result) {
                        if (err) {
                            return cb(err);
                        }

                        cb(null, result);
                    });
                };

                var updatePayRolls = function (params, cb) {
                    async.each(body, function (_payment, eachCb) {
                        payrollExpensUpdater(db, _payment, 1, eachCb);
                    }, function (err) {
                        if (err) {
                            return cb(err);
                        }

                        cb(null, 'Done');
                    })
                };

                var waterFallTasks = [mapBody, createInvoice, createPayment, updatePayRolls];

                async.waterfall(waterFallTasks, function (err, result) {
                    if (err) {
                        return next(err);
                    }

                    res.status(201).send({success: 'success'});
                    composeExpensesAndCache(req);
                });


                /*async.each(body, function (_payment, cb) {
                 var supplierObject = _payment.supplier;
                 var productObject = {};

                 productObject.product = _payment._id;
                 productObject.paid = _payment.paidAmount;
                 productObject.diff = _payment.diff;

                 supplierObject.paidAmount = _payment.paidAmount;
                 supplierObject.differenceAmount = _payment.differenceAmount;

                 totalAmount += _payment.paidAmount;
                 suppliers.push(supplierObject);
                 products.push(productObject);

                 payrollExpensUpdater(_payment, cb);
                 }, function (err) {
                 var payment;

                 if (err) {
                 return next(err);
                 }

                 salaryPayment.supplier = suppliers;
                 salaryPayment.paidAmount = totalAmount;

                 payment = new Payment(salaryPayment);
                 payment.save(function (err) {
                 if (err) {
                 return next(err);
                 }
                 res.status(201).send({success: 'success'});
                 composeExpensesAndCache(req);
                 });
                 });*/
            } else {
                res.status(403).send();
            }
        });
    };

    this.create = function (req, res, next) {
        var body = req.body;
        var Invoice = models.get(req.session.lastDb, 'wTrackInvoice', wTrackInvoiceSchema);
        var JobsModel = models.get(req.session.lastDb, 'jobs', JobsSchema);
        var workflowHandler = new WorkflowHandler(models);
        var invoiceId = body.invoice._id;
        var DbName = req.session.lastDb;
        var mid = body.mid;
        var data = body;
        var project;
        var type = "Payed";

        delete  data.mid;

        var moduleId = returnModuleId(req);
        var Payment;

        Payment = models.get(req.session.lastDb, 'Payment', PaymentSchema);

        function fetchInvoice(waterfallCallback) {
            Invoice.findById(invoiceId, waterfallCallback);
        }

        function savePayment(invoice, waterfallCallback) {
            var payment = new Payment(data);

            //payment.paidAmount = invoice.paymentInfo ? invoice.paymentInfo.total : 0;
            payment.name = invoice.sourceDocument;
            payment.whoCanRW = invoice.whoCanRW;
            payment.groups = invoice.groups;
            payment.createdBy.user = req.session.uId;
            payment.editedBy.user = req.session.uId;

            payment.save(function (err, payment) {
                if (err) {
                    return waterfallCallback(err);
                }
                waterfallCallback(null, invoice, payment);
            });
        }

        function invoiceUpdater(invoice, payment, waterfallCallback) {
            var totalToPay = (invoice.paymentInfo) ? invoice.paymentInfo.balance : 0;
            var paid = payment.paidAmount;
            var isNotFullPaid;
            var wId;
            var products = invoice.products;

            if (invoice.invoiceType === 'wTrack') {
                wId = 'Sales Invoice';
            } else {
                wId = 'Purchase Invoice';
            }
            //  var wId = ((DbName === MAINCONSTANTS.WTRACK_DB_NAME) || (DbName === "production") || (DbName === "development")) ? 'Sales Invoice' : 'Purchase Invoice';
            var request = {
                query  : {
                    wId         : wId,
                    source      : 'purchase',
                    targetSource: 'invoice'
                },
                session: req.session
            };

            totalToPay = parseFloat(totalToPay);
            paid = parseFloat(paid);

            isNotFullPaid = paid < totalToPay;

            if (isNotFullPaid) {
                request.query.status = 'In Progress';
                request.query.order = 1;
            } else {
                request.query.status = 'Done';
                request.query.order = 1;
            }

            workflowHandler.getFirstForConvert(request, function (err, workflow) {
                if (err) {
                    return waterfallCallback(err);
                }

                invoice.workflow = {
                    _id   : workflow._id,
                    name  : workflow.name,
                    status: workflow.status
                };
                invoice.paymentInfo.balance = (totalToPay - paid) / 100;
                // invoice.paymentInfo.unTaxed += paid / 100;// commented by Liliya forRoman
                // invoice.paymentInfo.unTaxed = paid * (1 + invoice.paymentInfo.taxes);
                invoice.payments.push(payment._id);

                invoice.paymentDate = new Date();

                Invoice.findByIdAndUpdate(invoiceId, invoice, {new: true}, function (err, invoice) {
                    if (err) {
                        return waterfallCallback(err);
                    }

                    async.each(products, function (product, cb) {

                        JobsModel.findByIdAndUpdate(product.jobs, {type: type}, {new: true}, function (err, result) {
                            if (err) {
                                return next(err);
                            }

                            project = result ? result.get('project') : null;

                            cb();
                        });

                    }, function () {
                        if (project) {
                            event.emit('fetchJobsCollection', {project: project});
                            event.emit('fetchInvoiceCollection', {project: project});
                        }
                    });

                    waterfallCallback(null, invoice, payment);
                });
            });
        }

        function updateWtrack(invoice, payment, waterfallCallback) {
            var paid = payment.paidAmount || 0;
            var wTrackIds = _.pluck(invoice.products, 'product');

            function updateWtrack(id, cb) {
                var wTrack = models.get(req.session.lastDb, 'wTrack', wTrackSchema);

                function wTrackFinder(innerWaterfallCb) {
                    wTrack.findById(id, function (err, wTrackDoc) {
                        if (err) {
                            return innerWaterfallCb(err);
                        }
                        innerWaterfallCb(null, wTrackDoc);
                    });
                }

                function wTrackUpdater(wTrackDoc, innerWaterfallCb) {
                    var wTrackAmount;
                    var revenue;
                    var differance;
                    var isPaid;
                    var amount;
                    var err;

                    if (!wTrackDoc) {
                        //err = new Error('wTracks are missing');

                        return innerWaterfallCb();
                    }

                    if (!wTrackDoc.isPaid) {
                        revenue = wTrackDoc.revenue;
                        wTrackAmount = wTrackDoc.amount;
                        differance = wTrackAmount - revenue; //differance - negative value

                        if ((paid + differance) >= 0) {
                            differance = -differance;
                        } else {
                            differance = paid;
                        }

                        paid -= differance;
                        wTrackAmount += differance;
                        isPaid = revenue === wTrackAmount;

                        wTrackDoc.amount = wTrackAmount / 100;
                        wTrackDoc.isPaid = isPaid;
                        wTrackDoc.save(function (err, saved) {
                            if (err) {
                                return innerWaterfallCb(err);
                            }
                            innerWaterfallCb(null, payment);
                        });
                    } else {
                        innerWaterfallCb(null, payment);
                    }
                }

                async.waterfall([wTrackFinder, wTrackUpdater], cb);
            }

            if (!paid) {
                return waterfallCallback(null, payment);
            }

            async.eachSeries(wTrackIds, updateWtrack, function (err, result) {
                if (err) {
                    return waterfallCallback(err);
                }

                waterfallCallback(null, payment);
            });

        }

        waterfallTasks = [fetchInvoice, savePayment, invoiceUpdater];

        if ((DbName === MAINCONSTANTS.WTRACK_DB_NAME) || (DbName === "production") || (DbName === "development")) {
            waterfallTasks.push(updateWtrack);
        }

        access.getEditWritAccess(req, req.session.uId, moduleId, function (access) {
            if (access) {
                async.waterfall(waterfallTasks, function (err, response) {
                    if (err) {
                        return next(err);
                    }

                    res.status(201).send(response);
                });
            } else {
                res.status(403).send();
            }
        });
    };

    this.totalCollectionLength = function (req, res, next) {
        var type = req.params.byType;
        var forSale = type === 'customers';
        var bonus = type === 'supplier';
        var salary = type === 'salary';

        var queryObject = {};
        var filter = req.query.filter;

        var departmentSearcher;
        var contentIdsSearcher;

        var contentSearcher;
        var waterfallTasks;

        var isWtrack = checkDb(req.session.lastDb);
        var options = {
            forSale : forSale,
            bonus   : bonus,
            salary  : salary,
            isWtrack: isWtrack
        };
        var Payment;

        Payment = returnModel(req, options);

        queryObject.$and = [];

        if (bonus) {
            queryObject.bonus = bonus;
        }

        if (filter && typeof filter === 'object') {
            if (filter.condition === 'or') {
                queryObject['$or'] = caseFilter(filter);
            } else {
                queryObject['$and'] = caseFilter(filter);
            }
        }

        if (!salary) {
            queryObject.$and.push({forSale: forSale});
        } else {
            queryObject.$and.push({isExpense: true});
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
            var everyOne = rewriteAccess.everyOne();
            var owner = rewriteAccess.owner(req.session.uId);
            var group = rewriteAccess.group(req.session.uId, deps);
            var whoCanRw = [everyOne, owner, group];
            var matchQuery = {
                $and: [
                    queryObject,
                    {
                        $or: whoCanRw
                    }
                ]
            };
            var Model = models.get(req.session.lastDb, "Payment", PaymentSchema);

            Model.aggregate(
                {
                    $match: matchQuery
                },
                {
                    $project: {
                        _id: 1
                    }
                },
                waterfallCallback
            );
        };

        contentSearcher = function (paymentIds, waterfallCallback) {
            var query;

            query = Payment.find(queryObject);
            query.count(waterfallCallback);
        };

        waterfallTasks = [departmentSearcher, contentIdsSearcher, contentSearcher];

        async.waterfall(waterfallTasks, function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send({count: result});
        });
    };

    this.putchBulk = function (req, res, next) {
        var body = req.body;
        var contentType = req.params.contentType;
        var uId;

        //var Payment = models.get(req.session.lastDb, 'Payment', PaymentSchema);
        var forSale = contentType === 'customers';
        var bonus = contentType === 'supplier';
        var salary = contentType === 'salary';
        var isWtrack = checkDb(req.session.lastDb);
        var options = {
            forSale : forSale,
            bonus   : bonus,
            salary  : salary,
            isWtrack: isWtrack
        };
        var Payment;

        Payment = returnModel(req, options);

        var moduleId = returnModuleId(req);

        if (req.session && req.session.loggedIn && req.session.lastDb) {
            uId = req.session.uId;
            access.getEditWritAccess(req, req.session.uId, moduleId, function (access) {
                if (access) {
                    async.each(body, function (data, cb) {
                        var id = data._id;

                        data.editedBy = {
                            user: uId,
                            date: new Date().toISOString()
                        };

                        if (moduleId === 60) {
                            delete data.paid;
                            delete data.differenceAmount;
                            delete data.paidAmount;
                        }

                        delete data._id;
                        Payment.findByIdAndUpdate(id, {$set: data}, {new: true}, cb);
                    }, function (err) {
                        if (err) {
                            return next(err);
                        }

                        res.status(200).send({success: 'updated'});
                    });
                } else {
                    res.status(403).send();
                }
            });
        } else {
            res.status(401).send();
        }
    };

    this.remove = function (req, res, next) {
        var db = req.session.lastDb;
        var id = req.params.id;
        var isWtrack = checkDb(req.session.lastDb);
        var workflowHandler = new WorkflowHandler(models);
        var Payment;
        var Invoice;
        var invoiceId;
        var paid;
        var workflowObj;
        var paymentInfo;
        var paymentInfoNew = {};
        var wId;
        var request;
        var project;
        var moduleId = req.headers.mid || returnModuleId(req);
        var JobsModel = models.get(req.session.lastDb, 'jobs', JobsSchema);
        var type = "Invoiced";

        moduleId = parseInt(moduleId);

        Payment = models.get(req.session.lastDb, 'Payment', PaymentSchema);

        access.getDeleteAccess(req, req.session.uId, moduleId, function (access) {
            if (access) {
                Payment.findByIdAndRemove(id, function (err, removed) {
                    if (err) {
                        return next(err);
                    }

                    var isNotFullPaid;

                    invoiceId = removed.get('invoice._id');
                    paid = removed.get('paidAmount');

                    if (invoiceId && (removed._type !== 'salaryPayment')) {

                        if (isWtrack) {
                            Invoice = models.get(req.session.lastDb, 'wTrackInvoice', wTrackInvoiceSchema);
                        } else {
                            Invoice = models.get(req.session.lastDb, 'Invoice', InvoiceSchema);
                        }

                        Invoice.findById({_id: invoiceId}, function (err, invoice) {
                            if (err) {
                                return next(err);
                            }

                            paymentInfo = invoice.get('paymentInfo');

                            if (invoice.invoiceType === 'wTrack') {
                                wId = 'Sales Invoice';
                            } else {
                                wId = 'Purchase Invoice';
                            }

                            request = {
                                query  : {
                                    wId         : wId,
                                    source      : 'purchase',
                                    targetSource: 'invoice'
                                },
                                session: req.session
                            };

                            isNotFullPaid = paymentInfo.total > (paymentInfo.balance + paid);

                            if (isNotFullPaid) {
                                request.query.status = 'In Progress';
                                request.query.order = 1;
                            } else {
                                request.query.status = 'New';
                                request.query.order = 1;
                            }

                            workflowHandler.getFirstForConvert(request, function (err, workflow) {
                                if (err) {
                                    return next(err);
                                }

                                workflowObj = {
                                    _id   : workflow._id,
                                    name  : workflow.name,
                                    status: workflow.status
                                };

                                paymentInfoNew.total = paymentInfo.total;
                                paymentInfoNew.taxes = paymentInfo.taxes;
                                paymentInfoNew.unTaxed = paymentInfoNew.total;
                                paymentInfoNew.balance = paymentInfo.balance + paid;

                                Invoice.findByIdAndUpdate(invoiceId, {
                                    $set: {
                                        workflow   : workflowObj,
                                        paymentInfo: paymentInfoNew
                                    }
                                }, {new: true}, function (err, result) {
                                    if (err) {
                                        return next(err);
                                    }

                                    var products = result.get('products');

                                    async.each(products, function (product, cb) {

                                        JobsModel.findByIdAndUpdate(product.jobs, {type: type}, {new: true}, function (err, result) {
                                            if (err) {
                                                return next(err);
                                            }

                                            project = result ? result.get('project') : null;

                                            cb();
                                        });

                                    }, function () {
                                        if (project) {
                                            event.emit('fetchJobsCollection', {project: project});
                                            event.emit('fetchInvoiceCollection', {project: project});
                                        }

                                        res.status(200).send({success: removed});
                                    });
                                });
                            });
                        });
                    } else if (invoiceId) {
                        Invoice = models.get(req.session.lastDb, 'payRollInvoice', payRollInvoiceSchema);

                        Invoice.findById(invoiceId, function (err, invoice) {
                            if (err) {
                                return next(err);
                            }


                            async.each(invoice.products, function (_payment, eachCb) {
                                payrollExpensUpdater(db, _payment, -1, eachCb);
                            }, function (err) {
                                if (err) {
                                    return next(err);
                                }

                                res.status(200).send({success: 'Done'});
                                composeExpensesAndCache(req);
                            })
                        })
                    } else {
                        res.status(200).send({success: 'Done'});
                    }
                });
            } else {
                res.send(403);
            }
        });

    };

    this.getForProject = function (req, res, next) {
        var ids = req.query.data;
        var Payment = models.get(req.session.lastDb, 'Payment', PaymentSchema);
        var moduleId = req.headers.mId || returnModuleId(req);

        access.getDeleteAccess(req, req.session.uId, moduleId, function (access) {
            if (access) {
                Payment.find({_id: {$in: ids}}, function (err, result) {
                    if (err) {
                        return next(err);
                    }

                    res.status(200).send(result);
                });
            } else {
                res.send(403);
            }
        });
    }

};

module.exports = Payment;
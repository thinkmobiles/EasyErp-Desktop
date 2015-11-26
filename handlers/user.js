/**
 * Created by Taras on 25.11.2015.
 */

var mongoose = require('mongoose');
var crypto = require('crypto');
var _ = require('lodash');


var User = function (models, event) {

    var access = require("../Modules/additions/access.js")(models);
    var userSchema = mongoose.Schemas['User'];
/*
    function checkIfUserLoginUnique(req, login, cb) {
        models.get(req.session.lastDb, 'Users', userSchema).find({login: login}, function (error, doc) {

            if (error) {
                cb({error: error});
            } else if (doc.length > 0) {

                if (doc[0].login === login) {
                    cb({unique: false});
                }

            } else if (doc.length === 0) {
                cb({unique: true});
            }

        });
    }*/


    /*
     User CRUD
     */
    this.createUser = function (req, res, next) {
        res.status(200).send({test200: 'OK'});

    };

    this.getOneUser = function (req, res, next) {

        if (!(req.session && req.session.loggedIn && req.session.lastDb )) {
            return next({status: 401});
        }

        access.getReadAccess(req, req.session.uId, 7, function (access) {
            var query;
            var data = {};

            if (!(access || (req.params.id === 'current'))) {
                return next({status: 403});
            }

            data.userId = req.params.id;

            if (!data.userId) {
                return next({status: 400, message: "id is missing"});
            }

            if (data.userId === 'current') {
                data.userId = req.session.uId;
            }

            query = models.get(req.session.lastDb, 'Users', userSchema).findOne({_id: data.userId});

            query.populate('RelatedEmployee', 'imageSrc name fullName')
                .populate('savedFilters._id')
                .populate('profile');

            query.exec(function (err, result) {
                var newUserResult = {};
                var savedFilters;

                if (err) {
                    return next(err);
                }

                if (result && result.toJSON().savedFilters) {
                    savedFilters = result.toJSON().savedFilters;
                    newUserResult = _.groupBy(savedFilters, '_id.contentView');
                }

                res.status(200).send({user: result, savedFilters: newUserResult});
            });
        });
    }

    this.getUser = function (req, res, next) {
        var query;
        var data = {};

        if (!(req.session && req.session.loggedIn && req.session.lastDb)) {
            return next({status: 401});
        }

         data.page = parseInt(req.query.page) || 1;
         data.count =  parseInt(req.query.count) || 50;

        query = models.get(req.session.lastDb, 'Users', userSchema).find({}, {__v: 0, upass: 0});
        query.sort({login: 1});

        if (data.page && data.count) {
            query.skip((data.page - 1) * data.count).limit(data.count);
        }

        query.populate('profile');
        query.exec(function (err, result) {

            if (err) {
                return next(err);
            }

            res.status(200).send({data: result});
        });
    };

    this.updateUser = function (req, res, next, options) {
/*

        var data = req.body;
        var _id = req.params.id;

        if (!_id) {
            return next({status: 400, message: "id is missing"});
        }

            if (options && options.changePass) {

                var shaSum = crypto.createHash('sha256');
                shaSum.update(data.pass);
                data.pass = shaSum.digest('hex');
                models.get(req.session.lastDb, 'Users', userSchema).findById(_id, function (err, result) {

                    if (err) {

                        logWriter.log("User.js update profile.update" + err);
                        res.send(500, {error: 'User.update BD error'});

                    } else {

                        var shaSum = crypto.createHash('sha256');
                        shaSum.update(data.oldpass);
                        var _oldPass = shaSum.digest('hex');

                        if (result.pass == _oldPass) {
                            delete data.oldpass;
                            updateUser();
                        } else {
                            logWriter.log("User.js update Incorect Old Pass");
                            res.send(500, {error: 'Incorect Old Pass'});
                        }
                    }
                });
            } else {
                updateUser();
            }

            function updateUser() {
                var query = {};
                var key = data.key;
                var deleteId = data.deleteId;
                var byDefault = data.byDefault;
                var viewType = data.viewType;
                var id;
                var savedFilters = models.get(req.session.lastDb, 'savedFilters', savedFiltersSchema);
                var filterModel = new savedFilters();

                if (data.changePass) {
                    query = {$set: data};

                    return updateThisUser(_id, query);
                }
                if (data.deleteId) {
                    savedFilters.findByIdAndRemove(deleteId, function (err, result) {
                        if (err) {
                            console.log(err);
                        }
                        if (result) {
                            id = result.get('_id');
                            query = {
                                $pull: {
                                    'savedFilters': {
                                        _id      : deleteId,
                                        byDefault: byDefault,
                                        viewType : viewType
                                    }
                                }
                            };

                            updateThisUser(_id, query);
                        }
                    });
                    return;
                }

                if (data.filter && data.key) {

                    filterModel.contentView = key;
                    filterModel.filter = data.filter;

                    var byDefault = data.useByDefault;
                    var viewType = data.viewType;
                    var newSavedFilters = [];

                    filterModel.save(function (err, result) {
                        if (err) {
                            return next({message:'error save filter'});
                        }

                        if (result) {
                            id = result.get('_id');

                            if (byDefault) {
                                models.get(req.session.lastDb, 'Users', userSchema).findById(_id, {savedFilters: 1}, function (err, result) {
                                    if (err) {
                                        return next(err);
                                    }
                                    var savedFilters = result.toJSON().savedFilters ? result.toJSON().savedFilters : [];

                                    savedFilters.forEach(function (filter) {
                                        if (filter.byDefault === byDefault) {
                                            filter.byDefault = '';
                                        }
                                    });

                                    savedFilters.push({
                                        _id      : id,
                                        byDefault: byDefault,
                                        viewType : viewType
                                    });

                                    query = {$set: {'savedFilters': savedFilters}};

                                    updateThisUser(_id, query);
                                });
                            } else {
                                newSavedFilters = {
                                    _id      : id,
                                    byDefault: byDefault,
                                    viewType : viewType
                                };

                                query = {$push: {'savedFilters': newSavedFilters}};

                                updateThisUser(_id, query);
                            }

                        }
                    });
                    return;
                }

                query = {$set: data};
                updateThisUser(_id, query);

                function updateThisUser(_id, query) {
                    var saveChanges = function () {
                        models.get(req.session.lastDb, 'Users', userSchema).findByIdAndUpdate(_id, query, {new: true}, function (err, result) {
                            if (err) {
                                return next(err);
                            }
                            req.session.kanbanSettings = result.kanbanSettings;
                            if (data.profile && (result._id == req.session.uId)) {
                                res.status(200).send({success: result, logout: true});
                            } else {
                                res.status(200).send({success: result});
                            }
                        });
                    };

                    if (query.$set && query.$set.login) {
                        checkIfUserLoginUnique(req, query.$set.login, function (resp) {
                            if (resp.unique) {
                                saveChanges();
                            } else if (resp.error) {
                                logWriter.log("User.js. create Account.find " + error);
                                res.send(500, {error: 'User.create find error'});
                            } else {
                                res.send(400, {error: "An user with the same Login already exists"});
                            }
                        });
                    } else {
                        saveChanges();
                    }

                }

            }



*/

    };

    this.deleteUser = function (req, res, next) {
        var id = req.params.id;

        if (!id) {
            return next({status: 400, message: "id is missing"});
        }

        if (!(req.session && req.session.loggedIn && req.session.lastDb)) {
            return next({status: 401});
        }

        access.getDeleteAccess(req, req.session.uId, 7, function (access) {

            if (!access) {
                return next({status: 403});
            }

            if (req.session.uId === id) {
                return next({status: 400, message: 'You cannot delete current user'});
            }

            models.get(req.session.lastDb, 'Users', userSchema).remove({_id: id}, function (err, result) {

                if (err) {
                    return next({status: 500});
                }
                res.send(200, {success: 'User remove success'});


            });
        });
    };
    /*
     User Login
     */
    this.login = function (req, res, next) {

        var data = req.body;
        if (!data) {
            return next({message: 'invalid body'});
        }
        data.login = data.login ? data.login : (data.username ? data.username : null);
        data.pass = data.pass ? data.pass : (data.password ? data.password : null);

        if (!((data.login || data.email || data.username) && data.dbId && data.pass)) {
            return next({
                status: 400,
                message: 'login or email or username and dbId,pass or password  is required strings'
            })
        }

        models.get(data.dbId, 'Users', userSchema).findOne(
            {$or: [{login: (data.login)}, {email: data.email}]},
            function (err, _user) {
                var lastAccess;

                if (err) {
                    return next(err);
                }

                if (!(_user && _user._id)) {
                    return next({
                        status: 400,
                        message: 'user not found'
                    });
                }

                var shaSum = crypto.createHash('sha256');
                shaSum.update(data.pass);

                if (!(((_user.login == data.login) || (_user.email == data.login)) && (_user.pass == shaSum.digest('hex')))) {
                    return next({
                        status: 400,
                        message: 'user not found'
                    });
                }

                req.session.loggedIn = true;
                req.session.uId = _user._id;
                req.session.uName = _user.login;
                req.session.lastDb = data.dbId;
                req.session.kanbanSettings = _user.kanbanSettings;
                lastAccess = new Date();
                req.session.lastAccess = lastAccess;
                models.get(data.dbId, 'Users', userSchema).findByIdAndUpdate(_user._id, {$set: {lastAccess: lastAccess}}, {new: true}, function (err, result) {

                    if (err) {
                        return next(err);
                    }

                    res.send(200);
                });
            });
    };
};


module.exports = User;
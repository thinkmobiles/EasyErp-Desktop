﻿var Nationality = function (models) {
    var mongoose = require('mongoose');
    var logWriter = require('../helpers/logWriter.js');
    var nationalitySchema =  mongoose.Schemas['nationality'];

    function getForDd(req, response) {
        var res = {};
        res.data = [];
        var query = models.get(req.session.lastDb, 'nationality', nationalitySchema).find({});
        query.exec(function (err, jobType) {
            if (err) {
                console.log(err);
                logWriter.log("JobType.js getForDd find " + err);
                response.send(500, { error: "Can't find jobType" });
            } else {
                res.data = jobType;
                response.send(res);
            }
        });
    }

    return {
        getForDd: getForDd
    };
};

module.exports = Nationality;

module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;
    var extend = require('mongoose-schema-extend');
    var Schema = mongoose.Schema;

    var basePaymentSchema = new Schema({
        ID              : Number,
        invoice         : {
            _id     : {type: ObjectId, ref: 'Invoice', default: null},
            name    : String,
            assigned: {
                _id : {type: ObjectId, ref: 'Employee', default: null},
                name: String
            }
        },
        paidAmount      : {type: Number, default: 0, set: setPrice},
        date            : {type: Date, default: Date.now},
        name            : {type: String, default: '', unique: true},
        workflow        : {type: String, enum: ['Draft', 'Paid'], default: 'Paid'},
        differenceAmount: {type: Number, default: 0, set: setPrice},
        whoCanRW        : {type: String, enum: ['owner', 'group', 'everyOne'], default: 'everyOne'},
        month           : {type: Number},
        year            : {type: Number},

        groups: {
            owner: {type: ObjectId, ref: 'Users', default: null},
            users: [{type: ObjectId, ref: 'Users', default: null}],
            group: [{type: ObjectId, ref: 'Department', default: null}]
        },

        createdBy: {
            user: {type: ObjectId, ref: 'Users', default: null},
            date: {type: Date, default: Date.now}
        },
        editedBy : {
            user: {type: ObjectId, ref: 'Users', default: null},
            date: {type: Date, default: Date.now}
        }
    }, {collection: 'Payment', discriminatorKey: '_type'});

    var PaymentSchema = basePaymentSchema.extend({
        forSale      : {type: Boolean, default: true},
        paymentRef   : {type: String, default: ''},
        supplier     : {
            _id     : {type: ObjectId, ref: 'Customers', default: null},
            fullName: String
        },
        paymentMethod: {
            _id : {type: ObjectId, ref: 'PaymentMethod', default: null},
            name: String
        },
        period       : {type: ObjectId, ref: 'Destination', default: null},
        bonus        : {type: Boolean}
    });

    var salaryPaymentSchema = basePaymentSchema.extend({
        isExpense    : {type: Boolean, default: true},
        supplier     : [{
            _id             : {type: ObjectId, ref: 'Employees', default: null},
            fullName        : String,
            paidAmount      : Number,
            differenceAmount: {type: Number, default: 0, set: setPrice}
        }],
        paymentMethod: {
            _id : {type: ObjectId, ref: 'ProductCategory', default: null},
            name: String
        },
        paymentRef   : {type: ObjectId, ref: 'PayRoll', default: null},//ref to PayRoll
        period       : {type: Date, default: null}
    });

    var payOutSchema = basePaymentSchema.extend({
        forSale         : {type: Boolean, default: false},
        supplier     : {
            _id             : {type: ObjectId, ref: 'Employees', default: null},
            fullName        : String
        },
        paymentMethod: {
            _id : {type: ObjectId, ref: 'ProductCategory', default: null},
            name: String
        },
        paymentRef   : {type: String, default: ''},
        period       : {type: Date, default: null}
    });

    mongoose.model('Payment', PaymentSchema);
    mongoose.model('salaryPayment', salaryPaymentSchema);
    mongoose.model('wTrackPayOut', payOutSchema);

    PaymentSchema.pre('save', function (next) {
        var payment = this;
        var db = payment.db.db;

        db.collection('settings').findOneAndUpdate({
                dbName: db.databaseName,
                name  : 'payment'
            },
            //[['name', 1]],
            {
                $inc: {seq: 1}
            },
            {
                returnOriginal: false,
                upsert        : true
            },
            function (err, rate) {
                if (err) {
                    return next(err);
                }

                payment.name += '_' + rate.value.seq;

                next();
            });
    });
    PaymentSchema.post('save', function (doc) {
        var payment = this;
        var db = payment.db.db;

        db.collection('Invoice').findOneAndUpdate({
                _id: doc.invoice._id
            },
            [['name', 1]],
            {
                $set: {paymentDate: new Date()}
            },
            null,
            function (err) {
                if (err) {
                    return console.error('An error was occurred during updating %s', doc.invoice);
                }

                console.log('Invoice %s was updated success', doc.invoice);
            });
    });

    salaryPaymentSchema.pre('save', function (next) {
        var payment = this;
        var db = payment.db.db;

        db.collection('settings').findOneAndUpdate({
                dbName: db.databaseName,
                name  : 'salary'
            },
            //[['name', 1]],
            {
                $inc: {seq: 1}
            },
            {
                returnOriginal: false,
                upsert        : true
            },
            function (err, rate) {
                if (err) {
                    return next(err);
                }

                payment.name = payment.year + '/' + payment.month + '_' + rate.value.seq;

                next();
            });
    });
    /*salaryPaymentSchema.post('save', function (doc) {
        var payment = this;
        var db = payment.db.db;

        db.collection('Invoice').findOneAndUpdate({
                _id: doc.invoice._id
            },
            [['name', 1]],
            {
                $set: {paymentDate: new Date()}
            },
            null,
            function (err) {
                if (err) {
                    return console.error('An error was occurred during updating %s', doc.invoice);
                }

                console.log('Invoice %s was updated success', doc.invoice);
            });
    });*/

    payOutSchema.pre('save', function (next) {
        var payment = this;

        payment.name = new Date().valueOf();
        next();
    });

    function setPrice(num) {
        return num * 100;
    }

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas['Payment'] = PaymentSchema;
    mongoose.Schemas['salaryPayment'] = salaryPaymentSchema;
    mongoose.Schemas['wTrackPayOut'] = payOutSchema;
})();
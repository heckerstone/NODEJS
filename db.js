var mongo = require('mongodb').MongoClient;
var assert = require('assert');

var url = 'mongodb://localhost:27017/test';

//暴露方法,对外开放使用
module.exports.DB = function (name, callback) {
    mongo.connect(url, function (err, db) {
        assert.equal(null, err);
        var collection = db.collection(name);
        if (typeof collection === 'undefined') {
            db.createCollection(name);
            collection = db.collection(name);
        }
        if (typeof callback === 'function') {
            callback(db, collection);
        }
    });
};
/****
 **var DB = require('./DB.js').DB;
 var ObjectId = require('mongodb').ObjectID;
 var docName = 'User';
 DB(docName, function (db, collection) {
    collection.bulkWrite([{insertOne:{document:message}}], function (err, result) {
        assert.equal(null, err);
        invokeCallback.call(callback, result);
        db.close();
    });
});
 **/
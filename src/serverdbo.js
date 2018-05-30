var mongo = require('mongodb').MongoClient
var ObjectId = require('mongodb').ObjectId
var TABLES = require('./const').TABLE_NAME
var dbo
//connect
var connect = (url, dbname, callback) => {
    mongo.connect(url, (err, db) => {
        dbo = db.db(dbname)
        callback(err)
    })
}

/* basic crub operation */
var insert = (col, insobj, callback) => {
    dbo.collection(col).insertOne(insobj, (err, rest) => {
        callback(err,rest.insertedId)
    })
}

var del = (col, wherestr, callback) => {
    dbo.collection(col).deleteOne(wherestr, (err, rest) => {
        callback(err)

    })
}

var mod = (col, wherestr, updatestr, callback) => {
    dbo.collection(col).updateOne(wherestr, updatestr, (err, rest) => {
        callback(err,rest)

    })
}

var find = (col, wherestr = {}, callback) => {
    dbo.collection(col).find(wherestr).toArray((err, result) => {
        callback(err, result)
    });
}


/* exposed database api */

//product
var product={
    add : (newproduct, callback) => {
        insert(TABLES.product, newproduct, callback)
    },
    del : (productId, callback) => {
        var _id=ObjectId(productId)
        var wherestr = {
            _id: _id
        }
        del(TABLES.product, wherestr, callback)
    },
    update: (productId, update,callback) => {
        var _id=ObjectId(productId)
        var wherestr = {
            _id: _id
        }
        var updatestr = {
            $set: update
        }
        mod(TABLES.product, wherestr, update,callback)
    },
    addPic:(productId, picId,callback) => {
        var _id=ObjectId(productId)
        var wherestr = {
            _id: _id
        }
        var update={
            $push:{
              pics: picId
            }
          }
        mod(TABLES.product, wherestr, update,callback)
    },
    delPic:(productId, picId,callback) => {
        var _id=ObjectId(productId)
        var wherestr = {
            _id: _id
        }
        var update={
            $pull:{
              pics: picId
            }
          }
        mod(TABLES.product, wherestr, update,callback)
    },
    get :(wherestr,callback)=>{
        wherestr.expireTime={ $gt: Date.now()}
        find(TABLES.product,wherestr,callback)
    },
    getOne:(productId,callback)=>{
        var _id=ObjectId(productId)
        var wherestr = {
            _id: _id
        }
        find(TABLES.product,wherestr,callback)
    }
}



module.exports = {
    connect,
    product,
}
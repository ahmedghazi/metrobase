var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    async = require('async'),
    Options = mongoose.model('Options'),
    Posts = mongoose.model('Posts'),
    Users = mongoose.model('Users'),
    request = require('request'),
    //fs = require("fs"),
    slug = require('slug'),
    moment = require('moment');

    


exports.test = function(next) {
    return next("helpers");
};


exports.updateOptions = function(key, value, callback) {
    Options.findOneAndUpdate({
            'meta.key': key
        }, {
            'meta.value': value
        }, {
            upsert: true,
            'new': false
        },
        function(err, options, raw) {
            if (err) {
                return console.log(err);
            }

            callback(err, {
                success: true
            });
        });
};




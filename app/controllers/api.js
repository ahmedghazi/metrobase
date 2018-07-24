var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    Contacts = mongoose.model('Contacts'),
    Metiers = mongoose.model('Metiers'),
    //request = require('request'),
    fs = require("fs"),
    parse = require('csv-parse'),
    jsonexport = require('jsonexport'),
    async = require('async'),
    //helpers = require('../lib/helpers'),
    slug = require('slug'),
  
    moment = require('moment'),
    momentDurationFormatSetup = require("moment-duration-format"),
    app;

module.exports = function(app) {
    app.use('/api', router);
};

router.get('/', function(req, res, next) {
    res.send("api")
});

router.get('/setup', function (req, res, next) {
    var body = {
        email:"admin",
        password:"passssap",
        type:"admin"
    }

    var user = new Users(body);
    user.save(function(err) {
        if (err) {
            return res.send(err);
        }

        res.redirect('/');
    });
    
});

router.get('/import', (req, res, next) => {
    var csvData=[];
    
    var parser = parse({delimiter: ';'}, function (err, data) {
        console.log(err)
        console.log(data)
        async.each(data,
            function(line, callback) {
                //console.log(line[0])
                var infos = {
                    society: line[0],
                    lastname: line[3],
                    firstname: line[4],
                    email: line[5],
                    fix: line[6],
                    mobile: line[7],
                    fonction: line[8],
                    addresse_1: line[10],
                    addresse_2: line[11],
                    zip: line[12],
                    city: line[13],
                    country: line[14]
                }
                    console.log(infos.email)
                var metier = line[1];
                var metier2 = line[2];

                if(infos.email.indexOf("@") > -1){
                    var query = {title: metier}
                    var update = {title: metier}
                    Metiers.findOneAndUpdate(query, update, {
                        upsert: true, new: true
                    }, function(err, metier, raw) {
                        var query = {title: metier2}
                        var update = {title: metier2}
                        Metiers.findOneAndUpdate(query, update, {
                            upsert: true, new: true
                        }, function(err, metier2, raw) {
                            var query = {email: infos.email}
                            var update = infos
                            update.metiers = [metier._id, metier2._id]
                            //console.log(update)
                            Contacts.findOneAndUpdate(query, update, {
                                upsert: true, new: true
                            }, function(err, contact, raw) {
                                console.log(contact.lastname)
                                callback()
                            });
                        });
                    });
                    
                }else{
                    callback()
                }
            },
            function(err) {
               return res.send("done")
            }
        );

        
    });
    fs.createReadStream("public/files/test1.csv").pipe(parser);
});

router.get('/all', function (req, res, next) {
    Contacts
        .find()
        .sort({date_created: 'desc'})
        .populate({path: 'metiers'})
        .exec(function(err, contacts) {
        //.find(function (err, contacts) {
            if (err) return next(err);
         
            return res.json(contacts)
    });
});

router.post('/update/:id', function (req, res, next) {
    //console.log(req.body.data)
    //const {data} = req.body;
    //var query = {_id: data._id}
    
    Contacts.findOne({ _id: req.params.id }, function(err, contact) {
        if (err) {
            return res.send(err);
        }

        for (prop in req.body.data) {
            contact[prop] = req.body.data[prop];
        }

        contact.save(function(_err) {
            if (_err) {
                console.log(_err)
                return res.send(_err);
            }

            return res.json({
                success: true,
                contact: contact
            })
        });
    });
});

router.get('/delete/:id', function (req, res, next) {
    Contacts.remove({
        _id: req.params.id
    }, function(err, post) {
        if (err) {
          return res.send(err);
        }

        return res.json({
            success: true
        })
    });
});

router.post('/update/metiers/:id', function (req, res, next) {
    const {data} = req.body;
    //console.log(req.body.data)

    var query = {_id: data._id}
    var update = {title: data.title}
    Metiers.findOneAndUpdate(query, update, {
        upsert: true, new: true
    }, function(err, metier, raw) {
        return res.json({
            success: true,
            metier: metier
        })
    });
});

router.post('/export', function (req, res, next) {
    //console.log(req.body)
    jsonexport(req.body.export, function(err, csv){
        if(err) return console.log(err);
        //console.log(csv);
        const fileName = Date.now();
        
        fs.writeFile("public/files/"+fileName+".csv", csv, function(err) {
            if (err) throw err;
            console.log(csv);
            return res.json({
                success: true,
                csv: "files/"+fileName+".csv"
            })
        });
        
    });
    
});


router.get('/drop', function(req, res, next) {
    req.resetDb();
    res.redirect("/api/setup");
    //res.send("done")
});

/*
mongodump --db sniff-development
mongorestore --db sniff-development ./sniff-development
*/
var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    slug = require('slug'),
    Metiers = mongoose.model('Metiers');
    Contacts = mongoose.model('Contacts');

module.exports = function (app) {
    app.use('/admin/contacts', isAuthenticated, router);
};

var isAuthenticated = function (req, res, next) {
    return next();
    if (req.isAuthenticated())
        return next();
        res.redirect('/security/login');
    
    return next();
}



router.get('/all', function (req, res, next) {
    Contacts
        .find()
        .sort({date_created: 'desc'})
        //.populate({path: 'parent jours'})
        .exec(function(err, docs) {
        //.find(function (err, contacts) {
            if (err) return next(err);
            return res.send(docs);
            
    });
});

router.get('/', function (req, res, next) {
    Contacts
        .find()
        .sort({date_created: 'desc'})
        .populate({path: 'metiers'})
        .exec(function(err, contacts) {
        //.find(function (err, contacts) {
            if (err) return next(err);
         
            res.render('admin/contacts/contacts', {
                title: 'Contacts',
                contacts: contacts,
                admin: req.user
            });
    });
});

router.get('/sort/:k/:s',  function (req, res, next) {
    var s = req.params.s;
    var k = req.params.k;
    Contacts
        .find()
        .sort([[k, s]])
        .exec(function(err, contacts) {
            if (err) return next(err);
            
            res.render('admin/contacts/contacts', {
                title: 'Contacts',
                contacts: contacts,
                admin: req.user
            });
    });
});

router.get('/filter/:f', function (req, res, next) {
    console.log(req.params.f)
    Contacts
        .find({post_type:""+req.params.f+""})
        .sort({date_created: 'desc'})
        //.populate({path: 'parent jours'})
        .exec(function(err, contacts) {
        //.find(function (err, contacts) {
            if (err) return next(err);
         
            res.render('admin/contacts/contacts', {
                title: 'Contacts',
                contacts: contacts,
                admin: req.user
            });
    });
});

router.post('/search', function (req, res, next) {
    var searchString = req.body.s;
    console.log(req.body.s)
    Contacts
        .find({'$or':[
            {'name':{'$regex':searchString, '$options':'i'}},
            //{'first_name':{'$regex':searchString, '$options':'i'}},
            //{'last_name':{'$regex':searchString, '$options':'i'}}
        ]})
        .sort({date_created: 'asc'})
        //.populate({path: 'media_portrait'})
        .exec(function(err, contacts) {
        //.find(function (err, contacts) {
            if (err) return next(err);
            res.render('admin/contacts/contacts', {
                title: 'Contacts',
                contacts: contacts,
                admin: req.user
            });
    });
});

router.get('/new', function (req, res, next) {
    Metiers
        .find()
        .sort({date_created: 'desc'})
        //.populate({path: 'parent jours'})
        .exec(function(err, metiers) {
        //.find(function (err, contacts) {
            if (err) return next(err);

            return res.render('admin/contacts/contacts-new', {
                title: 'Ajouter',
                metiers: metiers,
                admin: req.user
            });
        });
});

router.post('/new', function (req, res, next) {
    //console.log(req.body)
    //req.body.slug = slug(req.body.title);
    
    var post = new Contacts(req.body);
    post.save(function(err) {
        if (err) {
            return res.send(err);
        }

        res.redirect('/admin/contacts/');
    });
});

router.get('/edit/:id', function (req, res, next) {
    Metiers
        .find()
        .sort({date_created: 'desc'})
        //.populate({path: 'metiers'})
        .exec(function(err, metiers) {
            //console.log(metiers)
            Contacts
                .findOne({_id: req.params.id})
                .populate({path: 'metiers'})
                .exec(function(err, contact) {
                //.find(function (err, contacts) {
                    if (err) return next(err);

                    return res.render('admin/contacts/contacts-edit', {
                        title: 'Editer',
                        contact: contact,
                        metiers: metiers,
                        admin: req.user
                    });
                });
        });

    
});

router.post('/edit/:id', function (req, res, next) {
    Contacts.findOne({ _id: req.params.id }, function(err, contact) {
        if (err) {
            return res.send(err);
        }

        for (prop in req.body) {
            contact[prop] = req.body[prop];
        }

        contact.save(function(_err) {
            if (_err) {
                console.log(_err)
                return res.send(_err);
            }

            res.redirect('/admin/contacts/edit/'+req.params.id)
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

        res.redirect('/admin/contacts/');
    });
});


router.get('/contacts-table', function (req, res, next) {
    Contacts
        .find({post_type:"image"})
        .sort({date_created: 'desc'})
        //.populate({path: 'parent jours'})
        .exec(function(err, contacts) {
        //.find(function (err, contacts) {
            if (err) return next(err);
         
            res.render('admin/contacts/contacts-enfants-table', {
                title: 'Contacts',
                enfants: contacts,
                admin: req.user
            });
    });
});

router.get('/contacts-in-table', function (req, res, next) {
    Contacts
        .find({post_type:"page"})
        .sort({date_created: 'desc'})
        //.populate({path: 'parent jours'})
        .exec(function(err, contacts) {
        //.find(function (err, contacts) {
            if (err) return next(err);
         
            res.render('admin/contacts/contacts-in-table', {
                title: 'Contacts',
                enfants: contacts,
                admin: req.user
            });
    });
});

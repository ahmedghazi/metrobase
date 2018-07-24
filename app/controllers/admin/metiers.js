var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    slug = require('slug'),
    Metiers = mongoose.model('Metiers');

module.exports = function (app) {
    app.use('/admin/metiers', isAuthenticated, router);
};

var isAuthenticated = function (req, res, next) {
    return next();
    if (req.isAuthenticated())
        return next();
        res.redirect('/security/login');
    
    return next();
}



router.get('/all', function (req, res, next) {
    Metiers
        .find()
        .sort({date_created: 'desc'})
        //.populate({path: 'parent jours'})
        .exec(function(err, docs) {
        //.find(function (err, metiers) {
            if (err) return next(err);
            return res.send(docs);
            
    });
});

router.get('/', function (req, res, next) {
    Metiers
        .find()
        .sort({date_created: 'desc'})
        //.populate({path: 'category'})
        .exec(function(err, metiers) {
        //.find(function (err, metiers) {
            if (err) return next(err);
         
            res.render('admin/metiers/metiers', {
                title: 'Metiers',
                metiers: metiers,
                admin: req.user
            });
    });
});



router.get('/new', function (req, res, next) {
    return res.render('admin/metiers/metiers-new', {
        title: 'Ajouter',
        admin: req.user
    });
});

router.post('/new', function (req, res, next) {
    //console.log(req.body)
    //req.body.slug = slug(req.body.title);
    console.log(req.body)
    var post = new Metiers(req.body);
    post.save(function(err) {
        if (err) {
            return res.send(err);
        }

        res.redirect('/admin/metiers/');
    });
});

router.get('/edit/:id', function (req, res, next) {
    Metiers
        .findOne({_id: req.params.id})
        .populate({path: 'images users_in'})
        .exec(function(err, metier) {
        //.find(function (err, metiers) {
            if (err) return next(err);

            return res.render('admin/metiers/metiers-edit', {
                title: 'Editer',
                metier: metier,
                admin: req.user
            });
        });

    
});

router.post('/edit/:id', function (req, res, next) {
    Metiers.findOne({ _id: req.params.id }, function(err, metier) {
        if (err) {
            return res.send(err);
        }

        for (prop in req.body) {
            metier[prop] = req.body[prop];
        }

        metier.save(function(_err) {
            if (_err) {
                console.log(_err)
                return res.send(_err);
            }

            res.redirect('/admin/metiers/edit/'+req.params.id)
        });
    });
});


router.get('/delete/:id', function (req, res, next) {
    Metiers.remove({
        _id: req.params.id
    }, function(err, post) {
        if (err) {
          return res.send(err);
        }

        res.redirect('/admin/metiers/');
    });
});


router.get('/metiers-table', function (req, res, next) {
    Metiers
        .find({post_type:"image"})
        .sort({date_created: 'desc'})
        //.populate({path: 'parent jours'})
        .exec(function(err, metiers) {
        //.find(function (err, metiers) {
            if (err) return next(err);
         
            res.render('admin/metiers/metiers-enfants-table', {
                title: 'Metiers',
                enfants: metiers,
                admin: req.user
            });
    });
});

router.get('/metiers-in-table', function (req, res, next) {
    Metiers
        .find({post_type:"page"})
        .sort({date_created: 'desc'})
        //.populate({path: 'parent jours'})
        .exec(function(err, metiers) {
        //.find(function (err, metiers) {
            if (err) return next(err);
         
            res.render('admin/metiers/metiers-in-table', {
                title: 'Metiers',
                enfants: metiers,
                admin: req.user
            });
    });
});

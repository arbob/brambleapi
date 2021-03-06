var express = require('express');
var router = express.Router();
var fs = require('fs');
var Contact = require('../js/./model/contact')

/* GET home page. */
var _1brtinr = 0.1647;
var _1urvbrt = 1;
var http = require('http');
var ccxt = require('ccxt');
var request = require('request');
 

router.get('/api', function(req, res, next) {
  res.render('index', { title: 'Welcome to Bramble API' });
});

router.get('/api/whitepaper', function(req, res, next) {
    var file = fs.createReadStream('./public/pdf/whitepaper.pdf');
    var stat = fs.statSync('./public/pdf/whitepaper.pdf');
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=whitepaper.pdf');
    file.pipe(res);
});

router.get('/api/flappy/:urv', function(req, res, next){
    // res.json( );
    // res.json();
    res.json(Number(req.params.urv * _1brtinr).toFixed(2))
});

router.get('/api/exchanges', function(req, res, next){
    // res.json( );
    // res.json();
    res.json(ccxt.exchanges);
    
});

router.post('/api/contact', function(req, res, next){
    // res.json( );
    // res.json();
    // res.json(req.body);
    // res.send(req);
    let date_ob = new Date();
    var newContact = new Contact();
        newContact.name = req.body.name;
        newContact.email = req.body.email;
        newContact.message = req.body.message;
        newContact.date = date_ob;

    newContact.save(function(err) {
        if (err)
            throw err;
    });
    res.json('done');

    
});


module.exports = router;

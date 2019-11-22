// var express = require('express');
// var router = express.Router();

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

// module.exports = router;
var express = require('express');
var router = express.Router();
var fs = require('fs');
/* GET home page. */
var _1brtinr = 0.1647;
var _1urvbrt = 1;
var ccxt = require ('ccxt');

/* GET users listing. */
router.get('/wallet', function(req, res, next) {
  // res.render('index', { title: 'Welcome to Bramble Wallet API' });
  res.render('index', { title: 'Welcome to Bramble Wallet API. Created by Rahul Soshte. 2015rahul.soshte@ves.ac.in' })

});

router.get('/wallet/exchanges', function(req, res, next) {
// console.log (ccxt.exchanges) // print all available exchanges
  res.send(ccxt.exchanges);
});


module.exports = router;

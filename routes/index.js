var express = require('express');
var router = express.Router();
var fs = require('fs');
/* GET home page. */
router.get('/api', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/api/users', function(req, res, next) {
	// Comment out this line:
  //res.send('respond with a resource');

  // And insert something like this instead:
  res.json([{
  	id: 1,
  	username: "samsepi0l"
  }, {
  	id: 2,
  	username: "D0loresH4ze"
  }]);
});

router.get('/api/whitepaper', function(req, res, next) {
    var file = fs.createReadStream('./public/pdf/whitepaper.pdf');
    var stat = fs.statSync('./public/pdf/whitepaper.pdf');
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=whitepaper.pdf');
    file.pipe(res);
});


module.exports = router;

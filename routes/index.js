var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/pinit', function(req, res, next) {
  res.render('20180724/pinit', { title: 'Express' });
});

router.get('/velo', function(req, res, next) {
  res.render('20180726/velo', { title: 'Express' });
});

router.get('/momentum', function(req, res, next) {
  res.render('20180728/momentum', { title: 'Express' });
});

router.get('/proui', function(req, res, next) {
  res.render('20180730/proui', { title: 'Express' });
});

router.get('/dragdrop', function(req, res, next) {
  res.render('20180805/dragDrop', { title: 'Express' });
});

module.exports = router;

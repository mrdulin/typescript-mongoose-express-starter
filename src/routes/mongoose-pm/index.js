var express = require('express'),
    router = express.Router(),
    bodyParser = require('body-parser');

router.use(
    bodyParser.json(),
    bodyParser.urlencoded({ extended: false })
)

router.use('/project', require('./project'));
router.use('/user', require('./user'));

router.get('/', function(req, res) {
    res.render('./mongoose-pm/index.jade');
})

module.exports = router;
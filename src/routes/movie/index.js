var router = require('express').Router();
require(__base + 'middlewares/parser')(router);

router.use('/actors', require('./actors'));
router.use('/movies', require('./movies'));

module.exports = router;

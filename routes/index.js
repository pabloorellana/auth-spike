var router = require('express').Router();

router.use('/users', require('./users.js'));
router.use('/auth', require('./auth.js'));

module.exports = router;
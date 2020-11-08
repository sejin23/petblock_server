const router = require('express').Router();

router.use('/auth', require('./auth'));
router.use('/file', require('./files'));

module.exports = router;
const router = require('express').Router();

router.post('/signin', (req, res) => {
    console.log(req.body);

    res.json({result: 'success'});
})

module.exports = router;
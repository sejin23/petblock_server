const router = require('express').Router();
const Schema = require('../../models');
const User = Schema.user;
const Pet = Schema.pet;
const Record = Schema.record;

router.post('/uploadRecord', (req, res) => {
    const record = new Record({
        img: req.body.image
    });
    User.findById(req.body.userId, (e, data) => {
        if(e) console.log(e);
        data.pets.id(req.body.petId).records.push(record);

        data.save();
        res.json({result: true});
    })
})

module.exports = router;
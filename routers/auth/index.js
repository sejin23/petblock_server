const router = require('express').Router();
const Schema = require('../../models');
const User = Schema.user;
const OTP = Schema.otp;

router.use('/permitted', require('./permit'));
router.use('/users', require('./users'));

router.post('/otpRequest', (req, res) => {
    var number = Math.floor(Math.random() * 1000000) + 100000;
    if(number >= 1000000)
        number -= 100000;

    User.find({email: req.body.email}, (err, users) => {
        if(err) {
            console.log(err);
            res.json({otp: 0});
        } else if(users.length === 0) {
            console.log("해당되는 데이터가 없습니다.");
            res.json({otp: 1});
        } else {
            const currentDate = new Date();
            const newOTP = new OTP({number: number, valid: new Date(currentDate.getTime() + 300000), target: req.body.target});
            User.updateOne({
                email: req.body.email
            }, {
                otp: newOTP
            }, (error, data) => {
                if(error) {
                    console.log(error);
                    res.json({otp: 2});
                } else 
                    res.json({otp: number});
            })
        }
    })
});

router.post('/otpTerminate', (req, res) => {
    User.updateOne({
        email: req.body.email
    }, {
        $unset: {otp: 1}
    }, (err, result) => {
        if(err) {
            console.log(err);
        }
        res.json({result: true});
    });
})

router.post('/otpResponse', (req, res) => {
    User.find({'otp.number': req.body.number}, (err, users) => {
        if(err || users.length === 0) {
            console.log(err);
            res.json({result: false, errorMsg: '일치하는 OTP가 존재하지 않습니다.'});
        } else {
            if(new Date().getTime() - users[0].otp.valid.getTime() > 300000) {
                res.json({result: false, errorMsg: 'OTP 유효 시간이 지났습니다.'});
            } else {
                const pet = users[0].pets[users[0].otp.target];
                var info = {
                    userName: users[0].name,
                    userId: users[0].id,
                    petId: pet.id,
                    petName: pet.name,
                    img: pet.img,
                    species: pet.species,
                    breed: pet.breed,
                    bloodType: pet.bloodType,
                    sex: pet.sex,
                    birth: pet.birth,
                    weight: pet.weight,
                    neuter: pet.neuter,
                    records: pet.records
                };
                res.json({result: true, info: info});
            }
        }
    });
});

module.exports = router;
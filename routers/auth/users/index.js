const router = require('express').Router();
const path = require('path');
const Schema = require('../../../models');
const User = Schema.user;
const Pet = Schema.pet;
const upload = require('../../../uploadMiddleWare');

router.post('/signUp', (req, res) => {
    User.find({email: req.body.email}, (err, users) => {
        if(err) {
            console.log(err);
            res.json({result: false, errorMsg: "Database find error"});
        } else if(users.length > 0)
            res.json({result: false, errorMsg: "Email is duplicated"});
        else {
            const newUser = new User({name: req.body.name, email: req.body.email, password: req.body.password});
            newUser.save((error, data) => {
                if(error) {
                    console.log(error);
                    res.json({result: false, errorMsg: "Database save error"});
                } else
                    res.json({result: true});
            });
        }
    })
});

router.post('/signIn', (req, res) => {
    console.log(`login id: ${req.body.email} & pw: ${req.body.password}`);
    User.find({email: req.body.email, password: req.body.password}, (err, users) => {
        if(err) {
            console.log(err);
            res.json({result: false, errorMsg: "Database find error"});
        } else if(users.length === 0)
            res.json({result: false, errorMsg: "Email and Password do not match"});
        else
            res.json({result: true, id: users[0].id});
    })
});

router.post('/petInfo/download', (req, res) => {
    User.find({email: req.body.email}, (err, users) => {
        if(err) {
            console.log(err);
        } else {
            var pet = [];
            
            users[0].pets.map(data => {
                var records = [];
                data.records.map(record => {
                    records.push({
                        img: record.img,
                        date: record.date
                    });
                })
                pet.push({
                    id: data.id,
                    img: data.img,
                    name: data.name,
                    sex: data.sex? 1: 2,
                    year: parseInt(data.birth.substring(0, 4)),
                    month: parseInt(data.birth.substring(4, 6)),
                    day: parseInt(data.birth.substring(6, 8)),
                    weight: data.weight,
                    species: data.species,
                    breed: data.breed,
                    bloodType: data.bloodType,
                    neuter: data.neuter,
                    records: records
                });
            });
            res.json(pet);
        }
    })
})

router.post('/petInfo/upload', (req, res, next) => {
    const { newPet, email } = req.body;
    const pet = new Pet({
        img: '',
        name: newPet.name,
        sex: newPet.sex === 1? true: false,
        birth: String(newPet.year)+(newPet.month < 10? '0': '')+String(newPet.month)+(newPet.day < 10? '0': '')+String(newPet.day),
        weight: newPet.weight,
        species: newPet.species,
        breed: newPet.breed,
        bloodType: newPet.bloodType,
        neuter: newPet.neuter
    });
    
    User.updateOne({
        email: email
    }, {
        $push: {pets: pet}
    }, (err, result) => {
        if(err) res.json({result: err});
        else {
            res.json({result: 'success'});
        }
    })
});

router.post('/petInfo/uploadWithImage', upload.single('petImage'), (req, res, next) => {
    const petData = JSON.parse(req.body.petData);
    const pet = new Pet({
        img: req.file.filename,
        name: petData.name,
        sex: petData.sex === 1? true: false,
        birth: String(petData.year)+(petData.month < 10? '0': '')+String(petData.month)+(petData.day < 10? '0': '')+String(petData.day),
        weight: petData.weight,
        species: petData.species,
        breed: petData.breed,
        bloodType: petData.bloodType,
        neuter: petData.neuter
    });

    User.updateOne({
        email: petData.email
    }, {
        $push: {pets: pet}
    }, (err, result) => {
        if(err) {
            console.log(err);
            res.json({result: err, src: ''});
        } else {
            res.json({result: 'success', src: req.file.filename});
        }
    })
});

router.post('/petInfo/uploadExistingImg', (req, res) => {
    const { newPet, email } = req.body;
    const pet = new Pet({
        img: newPet.img,
        name: newPet.name,
        sex: newPet.sex === 1? true: false,
        birth: String(newPet.year)+(newPet.month < 10? '0': '')+String(newPet.month)+(newPet.day < 10? '0': '')+String(newPet.day),
        weight: newPet.weight,
        species: newPet.species,
        breed: newPet.breed,
        bloodType: newPet.bloodType,
        neuter: newPet.neuter
    });
    
    User.updateOne({
        email: email
    }, {
        $push: {pets: pet}
    }, (err, result) => {
        if(err) res.json({result: err});
        else {
            res.json({result: 'success'});
        }
    })
});

router.post('/petInfo/drop', (req, res) => {
    User.updateOne({
        email: req.body.email
    }, {
        $pull: {pets: {name: req.body.petName}}
    }, (err, result) => {
        if(err) res.json({result: err});
        else res.json({result: 'success'});
    })
});

router.post('/petInfo/dropWithImg', (req, res) => {
    User.updateOne({
        email: req.body.email
    }, {
        $pull: {pets: {name: req.body.petName}}
    }, (err, result) => {
        if(err) res.json({result: err});
        else {
            fs.unlink(__dirname + '/../../../uploads/' + req.body.email + '/' + req.body.img, err => {
                if(err) {
                    console.log(err);
                    res.json({result: err});
                } else {
                    res.json({result: 'success'});
                }
            });
        }
    });
});

router.post('/petInfo/dropImg', (req, res) => {
    fs.unlink(__dirname + '/../../../uploads/' + req.body.email + '/' + req.body.img, err => {
        if(err) {
            console.log(err);
            res.json({result: err});
        } else {
            res.json({result: 'success'});
        }
    })
})

module.exports = router;
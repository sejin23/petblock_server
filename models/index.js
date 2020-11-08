const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    number: {type: Number, required: true},
    valid: {type: Date, required: true},
    target: {type: Number, required: true}
})

const recordSchema = new mongoose.Schema({
    img: {type: String, default: '', required: true},
    date: {type: Date, default: +new Date() + 7*24*60*60*1000}
});

const petSchema = new mongoose.Schema({
    img: {type: String, default: ''},
    name: {type: String, required: true},
    sex: {type: Boolean, required: true},
    birth: {type: String, required: true},
    weight: {type: Number, min: 0},
    species: {type: String, required: true},
    breed: {type: String, default: ''},
    bloodType: {type: String, default: ''},
    neuter: {type: Boolean, default: false},
    records: [recordSchema]
});

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    pets: [petSchema],
    otp: otpSchema
});

module.exports = {
    user: mongoose.model('user', userSchema),
    pet: mongoose.model('pet', petSchema),
    record: mongoose.model('record', recordSchema),
    otp: mongoose.model('otp', otpSchema)
}
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const saltRounds = 10;

/**
 * Validation de la longueur du mots de passe
 */
let passwordLengthChecker = (password) => {
    if (!password) return false;
    else {
        if (password.length < 8) return false;
        else return true;
    }
};

/**
 * RegExp validation
 */
let passwordChecker = (password) => {
    const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
    return regExp.test(password);
};

/**
 * Validation message
 */
const passwordValidators = [
    {
        validator: passwordLengthChecker,
        message: 'Le de passe est inférieur à 8.'
    },
    {
        validator: passwordChecker,
        message: 'Le mots de passe doit contenir au moins une lettre en majuscule, minuscule, un nombre et une charactére spéciaux.'
    }
];

/**
 * SCHEMA
 * @type {never}
 */
const userSchema = Schema({
    email: {type: String, required: true},
    password: {type: String, required: true, validate: passwordValidators},
    lName: {type: String, required: true},
    fName: String,
    role: {type: String, required: true}
});

userSchema.pre('save', function (next) {
    if (!this.isModified('password')) return next();

    bcrypt.hash(this.password, saltRounds, (error, hash) => {
        if (error) return next;
        this.password = hash;
        next();
    })
});

userSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);

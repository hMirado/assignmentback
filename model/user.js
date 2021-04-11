let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let bcrypt = require('bcrypt');
let saltRounds = 10;
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");

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
let UserSchema = Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true, validate: passwordValidators},
    lName: {type: String, required: true},
    fName: String,
    image: String,
    id: {type: String, required: true},
    role: {type: String, required: true}
});

UserSchema.plugin(aggregatePaginate);

UserSchema.pre('save', function (next) {
    if (!this.isModified('password')) return next();

    bcrypt.hash(this.password, saltRounds, (error, hash) => {
        if (error) return next;
        this.password = hash;
        next();
    })
});

UserSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};


module.exports = mongoose.model('User', UserSchema);

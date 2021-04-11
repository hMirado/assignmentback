let mongoose = require('mongoose');
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");

let Schema = mongoose.Schema;

let AssignmentSchema = Schema({
    id: Number,
    dateDeRendu: Date,
    nom: String,
    rendu: Boolean,
    note: Number,
    remarque: String,
    image: String,
    matiere: String,
    auteur: {
        email: String,
        password: String,
        lName: String,
        fName: String,
        image: String,
        id: String,
        role: String
    },
    professeur: {
        email: String,
        password: String,
        lName: String,
        fName: String,
        image: String,
        id: String,
        role: String
    },
});

AssignmentSchema.plugin(aggregatePaginate);


// C'est à travers ce modèle Mongoose qu'on pourra faire le CRUD
module.exports = mongoose.model('Assignment', AssignmentSchema);

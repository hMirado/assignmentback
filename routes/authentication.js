const express = require('express');
const User = require('../model/user');
const jwt = require('jsonwebtoken');

/**
 * CONNEXION
 *
 * @type {Router}
 */

function login(req, res) {
    let assignment = new Assignment();
    assignment.id = req.body.id;
    assignment.nom = req.body.nom;
    assignment.dateDeRendu = req.body.dateDeRendu;
    assignment.rendu = req.body.rendu;

    console.log("POST assignment reçu :");
    console.log(assignment);

    assignment.save((err) => {
        if (err) {
            res.send("cant post assignment ", err);
        }
        res.json({ message: `${assignment.nom} saved!` });
    });
}

module.exports = {
    login
};


const express = require('express');
const User = require('../model/user');
const jwt = require('jsonwebtoken');
const router = express.Router();

/**
 * CONNEXION
 *
 * @type {Router}
 */
router.post('/login', (req, res) => {
    var email = req.body.email;
    var password = req.body.password;


    if (!email) {
        res.send("Veuillez saisir votre email.")
    }

    if (!password) {
        res.send("Veuillez saisir votre mots de passe.")
    }

    if (email && password) {
        User.findOne({email: email}, (error, user) => {
            if (error) {
                res.send(error)
            }
            if (!user) {
                res.send({message: "Votre email n'est assigné à aucune utilisateur"})
            }
            if (user) {
                const validPassword = user.comparePassword(password);
                if (!validPassword) {
                    res.send({message: "Mots de passe incorrecte."})
                } else {
                    const token = jwt.sign({userId: user._id.toString()}, '123456',{expiresIn: '24h'});
                    res.json({
                       success: true,
                       message: "Bonjour " + user.lName,
                       token: token,
                       user: {lName: user.lName, fName: user.fName, email: user.email, role: user.role}
                    });
                }
            }
        });
    }
});

/**
 * ENREGISTEMENT UTILISATEUR
 *
 * @type {Router}
 */
router.post('/register', (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    var lName = req.body.lName;
    var fName = req.body.fName;
    var role = req.body.role;

    if (!email) {
        res.send("Veuillez saisir l'email de l'utilisateur.")
    }

    if (!password) {
        res.send("Veuillez saisir le mots de passe de l'utilisateur.")
    }

    if (!role) {
        res.send("Veuillez saisir le rôle de l'utilisateur.")
    }

    if (!lName) {
        res.send("Veuillez saisir le rôle de l'utilisateur.")
    }
    
    if (email && password && role && lName) {
        let user = new User({
            email: email,
            password: password,
            lName: lName,
            fName: fName,
            role: role,
        });

        user.save((error) => {
            if (error) {
                if (error.code === 11000) {
                    res.send("L'email est déjà utilisé")
                }
                if (error.errors) {
                    if (error.errors.password) {
                        res.send(error.errors.password.message)
                    } else {
                        res.send(error)
                    }
                } else {
                    res.send("Impossible d'enregistrer l'utilisateur" + error)
                }
            }

            if (!error) {
                res.json({success: true, message: "Utilisateur enregistrer"})
            }
        })
    }
});

module.exports = router;

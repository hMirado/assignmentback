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


module.exports = router;

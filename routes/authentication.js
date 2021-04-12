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


    if (email && password) {
        User.findOne({email: email}, (error, user) => {
            if (error) {
                res.json(error)
            }
            if (!user) {
                res.json({message: "Votre email n'est assigné à aucune utilisateur"})
            }
            if (user) {
                const validPassword = user.comparePassword(password);
                if (!validPassword) {
                    res.json({message: "Mots de passe incorrecte."})
                } else {
                    const token = jwt.sign({userId: user._id.toString()}, '123456',{expiresIn: '24h'});
                    res.json({
                       success: true,
                       message: "Bonjour " + user.lName,
                       token: token,
                       user: {lName: user.lName, fName: user.fName, email: user.email, id: user.id, role: user.role}
                    });
                }
            }
        });
    }
});


module.exports = router;

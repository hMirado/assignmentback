let express = require('express');
let User = require('../model/user');
const router = express.Router();

/**
 * ENREGISTEMENT UTILISATEUR
 *
 * @type {Router}
 */
router.post('/register', (req, res) => {
    let user = new User();
    user.lName = req.body.lName;
    user.fName = req.body.fName;
    user.email = req.body.email;
    user.password = req.body.password;
    user.id = req.body.id;
    user.image =req.body.image;
    user.role = req.body.role;

    user.save((err) => {
        if (err) {
            res.send("Une erreur est survenue : ", err);
        }
        res.json({ message: `${user.fName} enregistrer!` });
    });
});


/**
 * ENREGISTEMENT UTILISATEUR
 *
 * @type {Router}
 */
router.get('/', (req, res) => {
    var role = req.query.role==="professeur"?"professeur":req.query.role==="etudiant"?"etudiant":"admin";

    User.find({'role': role}, (err, users) => {
        if (err) res.send(err);
        res.json(users);
    }).sort({_id: -1})
});

module.exports = router;

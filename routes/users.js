let express = require('express');
let User = require('../model/user');
const router = express.Router();

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
    var image = req.body.image;
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
        User.find({role: role}).countDocuments((err, userCount) => { // On recupére le nombre d'utilisateur par rapport au role
            if (err) throw err;

            let roleCourt = (role === 'professeur') ? 'prof' : (role === 'etudiant') ? 'etu' : 'admin';

            var id = roleCourt + "0000" + (userCount+1).toString().slice(-5);

            let user = new User({
                email: email,
                password: password,
                lName: lName,
                fName: fName,
                image: image,
                id: id,
                role: role,
            });

            user.save((error) => {
                if (error) {
                    if (error.code === 11000) {
                        res.send("L'email est déjà utilisé");
                    }
                    if (error.errors) {
                        if (error.errors.password) {
                            res.send(error.errors.password.message);
                        } else {
                            res.send(error);
                        }
                    } else {
                        res.send("Impossible d'enregistrer l'utilisateur" + error);
                    }
                } else {
                    res.json({success: true, message: "Utilisateur enregistrer"});
                }
            })
        });
    }
});


/**
 * ENREGISTEMENT UTILISATEUR
 *
 * @type {Router}
 */
router.get('/', (req, res) => {
    var role = req.query.role==="professeur"?"professeur":req.query.role==="etudiant"?"etudiant":"admin";
    let roleCourt = (role === 'professeur') ? 'prof' : (role === 'etudiant') ? 'etu' : 'admin';

    /*var aggregateQuery = User.aggregate([
        {$match: {role: role}}
    ]);
    User.aggregatePaginate(
        aggregateQuery,
        {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10,
        },
        (err, users) => {
            if (err) {
                res.send(err);
            }
            res.json(users);
        }
    );*/
    User.find({'role': role}, (err, users) => {
        if (err) res.send(err);
        res.json(users);
    })
});

module.exports = router;

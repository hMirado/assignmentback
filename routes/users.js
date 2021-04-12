let express = require('express');
let User = require('../model/user');
const router = express.Router();

/**
 * ENREGISTEMENT UTILISATEUR
 *
 * @type {Router}
 */
router.post('/register', (req, res) => {
    var role = req.body.role;

    User.find({role: role}).countDocuments((err, userCount) => { // On recupére le nombre d'utilisateur par rapport au role
        if (err) throw err;

        let roleCourt = (role === 'professeur') ? 'prof' : (role === 'etudiant') ? 'etu' : 'admin';

        var id = roleCourt + "0000" + (userCount+1).toString().slice(-5);

        var user = new User({
            lName: req.body.lName,
            fName: req.body.fName,
            email: req.body.email,
            password: req.body.password,
            id: id,
            image: req.body.image,
            role: role
        });

        user.save((err) => {
            if (err) {
                res.send("Une erreur est survenue : ", err);
            }
            res.json({ message: `${user.fName} enregistrer!` });
        });
    });
});


/**
 * ENREGISTEMENT UTILISATEUR
 *
 * @type {Router}
 */
router.get('/', (req, res) => {
    var role = req.query.role==="professeur"?"professeur":req.query.role==="etudiant"?"etudiant":"admin";

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

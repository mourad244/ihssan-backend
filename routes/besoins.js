const express = require('express');
const validations = require('../startup/validations');
const auth = require('../middleware/auth');
const logger = require('../startup/logging');
const role = require('../middleware/role');
const validateObjectId = require('../middleware/validateObjectId');
const _ = require('lodash');
const { Bien } = require('../models/bien');
const { Association } = require('../models/association');
const router = express.Router();

router.put('/:associationId', [auth, role], async (req, res) => {
	const { error } = validations.besoin(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const association = await Association.findOne({ _id: req.params.associationId });
	if (!association) return res.status(404).send("l'association avec cette id n'existe pas.");

	const { biensId } = req.body;
	// check if biens are valide
	const biens = await Bien.find({
		_id: {
			$in: biensId
		}
	});
	if (!biens) return res.status(404).send("aucun bien  avec cette id n'est enrgeristé.");

	association.biensId = _.map(biens, _.partialRight(_.pick, '_id'));
	association.save();

	res.send(association.biensId);
});

// liste des besoins d'une association donnée

router.get('/association/:associationId', validateObjectId, async (req, res) => {
	const association = await Association.findById(req.params.associationId).populate('biensId').select('biensId');

	if (!association) return res.status(404).send("le besoin avec cette id n'existe pas.");

	res.send(association);
});

// liste des associations d'un bien donné
router.get('/bien/:bienId', validateObjectId, async (req, res) => {
	const associations = await Association.find({
		biensId: {
			$in: req.params.bienId
		}
	});
	if (!associations) return res.status(404).send("aucune association  avec cette id n'est enrgeristé.");
	res.send(associations);
});

module.exports = router;

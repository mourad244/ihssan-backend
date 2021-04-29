const mongoose = require('mongoose');

const schemaDon = new mongoose.Schema({
	donnateurId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Donnateur',
		required: true
	},
	associationId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Association',
		required: true
	},
	biensId: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Bien'
		}
	],
	message: String,
	date: {
		type: Date,
		required: true,
		default: Date.now
	}
});

const Don = mongoose.model('Don', schemaDon);

exports.schemaDon = schemaDon;
exports.Don = Don;

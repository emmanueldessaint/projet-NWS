const mongoose = require('mongoose');

const studentSchema = mongoose.Schema({
  id: {type: String, required: true},
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  mail: { type: String, required: true },
  annee: { type: String, required: true },
});

module.exports = mongoose.model('Student', studentSchema);
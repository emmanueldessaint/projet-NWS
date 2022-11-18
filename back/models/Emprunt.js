const mongoose = require('mongoose');

const empruntSchema = mongoose.Schema({
  id: { type: String, required: true },
  id_etudiant: { type: String, required: true },
  id_materiel: { type: String, required: true },
  date_emprunt: { type: String, required: true },
  date_rendu: { type: String, required: true },
});

module.exports = mongoose.model('Emprunt', empruntSchema);
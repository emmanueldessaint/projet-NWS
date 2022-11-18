const mongoose = require('mongoose');

const materielSchema = mongoose.Schema({
  id: {type: String, required: true},
  nom: { type: String, required: true },
  stock: { type: Number, required: true },
});

module.exports = mongoose.model('Materiel', materielSchema);
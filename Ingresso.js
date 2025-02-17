const mongoose = require('mongoose');

const ingressoSchema = new mongoose.Schema({
  tipo: { type: String, required: true },
  preco: { type: Number, required: true },
  quantidade: { type: Number, required: true },
  descricao: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Ingresso', ingressoSchema);

const mongoose = require('mongoose');

const IngressoSchema = new mongoose.Schema({
  tipo: {
    type: String,
    required: [true, "O tipo do ingresso é obrigatório!"],
  },
  quantidade: {
    type: Number,
    required: [true, "A quantidade é obrigatória!"],
  }
}, { timestamps: true });

module.exports = mongoose.model('Ingresso', IngressoSchema, 'ingressos');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, "O nome é obrigatório!"],
  },
  email: {
    type: String,
    required: [true, "O e-mail é obrigatório!"],
    unique: true,
    match: [/^\S+@\S+\.\S+$/, "Por favor, insira um e-mail válido!"],
  },
  senha: {
    type: String,
    required: [true, "A senha é obrigatória!"],
  },
  isAdmin: {
    type: Boolean,
    default: false, // Por padrão, o usuário não é administrador
  },
  ticketsComprados: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket',
  }],
}, { timestamps: true });
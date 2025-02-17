const mongoose = require('mongoose');
require('dotenv').config(); // Para carregar as variáveis do .env

const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ Conectado ao MongoDB com sucesso!'))
  .catch(err => console.error('❌ Erro ao conectar no MongoDB:', err));

module.exports = mongoose;


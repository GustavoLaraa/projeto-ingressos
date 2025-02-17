const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const ticketRoutes = require('./routes/ticketRoutes');
const authRoutes = require('./routes/authRoutes');

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api', ticketRoutes); // Prefixo para todas as rotas de tickets
app.use('/api/auth', authRoutes);

// Conectar ao banco de dados MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Conectado ao MongoDB');
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🔥 Servidor rodando na porta ${PORT}`);
    });
  })
  .catch(err => console.error('❌ Erro ao conectar ao MongoDB:', err));

// Tratamento de erros global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Algo deu errado!', error: err.message });
});
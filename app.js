const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes'); 
const ingressoRoutes = require('./routes/ingressoRoutes');
const mustacheExpress = require('mustache-express');
const authMiddleware = require('./middlewares/authMiddleware'); 
const User = require('./models/User'); 
const Ingresso = require('./models/Ingresso'); 

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

// Inicializa o Express
const app = express();

// Configura o Mustache como mecanismo de visualização
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', './src/views');

app.get('/comprar', authMiddleware, (req, res) => {
  res.render('comprar');
});

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas da API
app.use('/api/auth', authRoutes); 
app.use('/api', ingressoRoutes); 

// Rotas para a Interface Web
app.get('/login', (req, res) => {
  res.render('login'); 
});

// Rota para o histórico de compras (protegida por autenticação)
app.get('/historico', authMiddleware, async (req, res) => {
  try {
    // Busca o usuário pelo ID e popula os ingressos comprados
    const user = await User.findById(req.userId).populate('ingressosComprados');
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado!' });
    }
    // Renderiza a página de histórico com os ingressos comprados
    res.render('historico', { ingressos: user.ingressosComprados });
  } catch (error) {
    console.error('Erro ao buscar histórico de compras:', error);
    res.status(500).json({ message: 'Erro ao buscar histórico de compras', error: error.message });
  }
});

// Rota para visualizar um ingresso (protegida por autenticação)
app.get('/ingresso/:id', authMiddleware, async (req, res) => {
  try {
    // Busca o ingresso pelo ID
    const ingresso = await Ingresso.findById(req.params.id);
    if (!ingresso) {
      return res.status(404).json({ message: 'Ingresso não encontrado!' });
    }
    // Renderiza a página de visualização do ingresso
    res.render('ingresso', { ingresso });
  } catch (error) {
    console.error('Erro ao buscar ingresso:', error);
    res.status(500).json({ message: 'Erro ao buscar ingresso', error: error.message });
  }
});

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

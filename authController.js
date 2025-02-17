const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

// Função para gerar token JWT
const gerarToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );
};

// Registrar um novo usuário
exports.register = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    // Validação dos campos
    if (!nome || !email || !senha) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios!' });
    }

    // Verifica se o e-mail já está em uso
    const usuarioExistente = await User.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ message: 'Este e-mail já está em uso!' });
    }

    // Cria o usuário
    const user = await User.create({ nome, email, senha });

    // Gera o token JWT
    const token = gerarToken(user);

    // Remove a senha da resposta
    const userResponse = { ...user._doc };
    delete userResponse.senha;

    // Retorna sucesso
    res.status(201).json({ message: 'Usuário registrado com sucesso!', user: userResponse, token });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({ message: 'Erro ao registrar usuário', error: error.message });
  }
};

// Login do usuário
exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Validação dos campos
    if (!email || !senha) {
      return res.status(400).json({ message: 'E-mail e senha são obrigatórios!' });
    }

    // Verifica se o usuário existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'E-mail ou senha inválidos!' });
    }

    // Verifica a senha (neste exemplo, a senha não está criptografada)
    if (user.senha !== senha) {
      return res.status(401).json({ message: 'E-mail ou senha inválidos!' });
    }

    // Gera o token JWT
    const token = gerarToken(user);

    // Remove a senha da resposta
    const userResponse = { ...user._doc };
    delete userResponse.senha;

    // Retorna sucesso
    res.status(200).json({ message: 'Login bem-sucedido!', user: userResponse, token });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ message: 'Erro ao fazer login', error: error.message });
  }
};

const jwt = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config();

const gerarToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email }, // Payload
    process.env.JWT_SECRET, // Chave secreta
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' } // Tempo de expiração
  );
};

exports.register = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ message: "Todos os campos são obrigatórios!" });
    }

    // Verifica se o e-mail já está em uso
    const usuarioExistente = await User.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ message: "Este e-mail já está em uso!" });
    }

    // Cria o usuário
    const user = await User.create({ nome, email, senha });
    const token = gerarToken(user);

    // Remove a senha da resposta
    const userResponse = { ...user._doc };
    delete userResponse.senha;

    res.status(201).json({ message: "Usuário registrado com sucesso!", user: userResponse, token });
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    res.status(500).json({ message: "Erro ao registrar usuário", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ message: "E-mail e senha são obrigatórios!" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "E-mail ou senha inválidos!" });
    }

    if (user.senha !== senha) {
      return res.status(401).json({ message: "E-mail ou senha inválidos!" });
    }

    const token = gerarToken(user);

    // Remove a senha da resposta
    const userResponse = { ...user._doc };
    delete userResponse.senha;

    res.status(200).json({ message: "Login bem-sucedido!", user: userResponse, token });
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    res.status(500).json({ message: "Erro ao fazer login", error: error.message });
  }
};
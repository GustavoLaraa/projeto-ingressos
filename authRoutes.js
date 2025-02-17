const express = require('express');
const { body, validationResult } = require('express-validator');
const authController = require('../controllers/authController');

const router = express.Router();

// Validação para registro
const validarRegistro = [
  body('nome').notEmpty().withMessage('O nome é obrigatório!'),
  body('email').isEmail().withMessage('E-mail inválido!'),
  body('senha').isLength({ min: 6 }).withMessage('A senha deve ter pelo menos 6 caracteres!'),
];

// Rota de Registro
router.post('/register', validarRegistro, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  authController.register(req, res);
});

// Validação para Login
const validarLogin = [
  body('email').isEmail().withMessage('E-mail inválido!'),
  body('senha').notEmpty().withMessage('A senha é obrigatória!'),
];

// Rota de Login
router.post('/login', validarLogin, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  authController.login(req, res);
});

module.exports = router;

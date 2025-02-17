const express = require('express');
const router = express.Router();
const ingressoController = require('../controllers/ingressoController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

// Verifica se o controlador está carregado corretamente
console.log("Ingresso Controller:", ingressoController);

// Rotas públicas
router.get('/ingressos', ingressoController.listarIngressos);

// Rotas protegidas (apenas usuários autenticados)
router.post('/comprar', authMiddleware, ingressoController.comprarIngresso);
router.get('/historico', authMiddleware, ingressoController.historicoCompras);

// Rotas administrativas (apenas administradores)
router.post('/ingressos', authMiddleware, adminMiddleware, ingressoController.criarIngresso);
router.put('/ingressos/:id', authMiddleware, adminMiddleware, ingressoController.atualizarIngresso);
router.delete('/ingressos/:id', authMiddleware, adminMiddleware, ingressoController.deletarIngresso);

module.exports = router;

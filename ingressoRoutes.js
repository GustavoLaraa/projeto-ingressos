const express = require('express');
const router = express.Router();
const ingressoController = require('../controllers/ingressoController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

console.log("🔍 Rotas de Ingressos carregadas!");

// Rotas de ingressos
router.get('/ingressos', ingressoController.listarIngressos);
router.post('/ingressos', authMiddleware, adminMiddleware, ingressoController.criarIngresso);
router.put('/ingressos/:id', authMiddleware, adminMiddleware, ingressoController.atualizarIngresso);
router.delete('/ingressos/:id', authMiddleware, adminMiddleware, ingressoController.deletarIngresso);

// Rotas de compra e histórico
router.post('/comprar', authMiddleware, ingressoController.comprarIngresso);
router.get('/ingressos/historico', authMiddleware, ingressoController.historicoCompras);

module.exports = router;

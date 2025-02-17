const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

// Rotas públicas
router.get('/tickets', ticketController.listarTickets);

// Rotas protegidas (apenas usuários autenticados)
router.post('/comprar', authMiddleware, ticketController.comprarTicket);
router.get('/historico', authMiddleware, ticketController.historicoCompras);

// Rotas administrativas (apenas administradores)
router.post('/tickets', authMiddleware, adminMiddleware, ticketController.criarTicket);
router.put('/tickets/:id', authMiddleware, adminMiddleware, ticketController.atualizarTicket);
router.delete('/tickets/:id', authMiddleware, adminMiddleware, ticketController.deletarTicket);

module.exports = router;
const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController'); // Verifique o caminho
const authMiddleware = require('../middlewares/authMiddleware');

// Rota para listar tickets
router.get('/tickets', ticketController.listarTickets); // Certifique-se de que o método existe

// Rota para comprar tickets
router.post('/comprar', authMiddleware, ticketController.comprarTicket);

module.exports = router;
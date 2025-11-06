const express = require('express');
const router = express.Router();
const kanbanController = require('../controllers/kanbanController');
const { authenticateToken } = require('../middleware/auth');

// Board
router.get('/board/:workAreaId', authenticateToken, kanbanController.getBoard);

// Stats
router.get('/stats/:workAreaId', authenticateToken, kanbanController.getStats);

// Columns
router.post('/columns', authenticateToken, kanbanController.createColumn);
router.put('/columns/:id', authenticateToken, kanbanController.updateColumn);
router.delete('/columns/:id', authenticateToken, kanbanController.deleteColumn);
router.put('/columns/positions/update', authenticateToken, kanbanController.updateColumnPositions);

// Cards
router.post('/cards', authenticateToken, kanbanController.createCard);
router.put('/cards/:id', authenticateToken, kanbanController.updateCard);
router.delete('/cards/:id', authenticateToken, kanbanController.deleteCard);
router.put('/cards/positions/update', authenticateToken, kanbanController.updateCardPositions);

module.exports = router;

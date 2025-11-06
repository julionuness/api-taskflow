const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authenticateToken } = require('../middleware/auth');

// Get user notifications
router.get('/', authenticateToken, notificationController.getUserNotifications);

// Mark notification as read
router.put('/:id/read', authenticateToken, notificationController.markAsRead);

// Mark all notifications as read
router.put('/read-all', authenticateToken, notificationController.markAllAsRead);

// Generate notifications (pode ser chamado por um cron job)
router.post('/generate', authenticateToken, notificationController.generateNotifications);

// Test email
router.post('/test-email', authenticateToken, notificationController.testEmail);

// Clear all notifications (útil para testes - use com cuidado!)
router.delete('/clear-all', authenticateToken, notificationController.clearAllNotifications);

module.exports = router;

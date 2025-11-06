const express = require('express');
const router = express.Router();
const activityLogController = require('../controllers/ActivityLogController');
const { authenticateToken } = require('../middleware/auth');

// Todas as rotas requerem autenticação
router.use(authenticateToken);

// Rotas de histórico de atividades
router.get('/workarea/:workAreaId', activityLogController.getWorkAreaActivity);
router.get('/workarea/:workAreaId/recent', activityLogController.getRecentActivity);
router.get('/workarea/:workAreaId/stats', activityLogController.getActivityStats);
router.get('/entity/:entityType/:entityId', activityLogController.getEntityActivity);

module.exports = router;

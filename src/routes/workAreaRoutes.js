const express = require('express');
const router = express.Router();
const workAreaController = require('../controllers/WorkAreaController');
const { authenticateToken } = require('../middleware/auth');

// Rotas específicas devem vir ANTES das rotas com parâmetros
router.get('/my-workareas', authenticateToken, workAreaController.getUserWorkAreas);

// Rotas para gerenciar usuários em áreas de trabalho (ANTES das rotas com :id)
router.post('/add-user', authenticateToken, workAreaController.addUserToWorkArea);
router.delete('/remove-user', authenticateToken, workAreaController.removeUserFromWorkArea);
router.put('/user-role/:id', authenticateToken, workAreaController.updateUserRole);

// Rotas para áreas de trabalho
router.post('/', authenticateToken, workAreaController.createWorkArea);
router.get('/:id/users', authenticateToken, workAreaController.getWorkAreaUsers);
router.get('/:id', authenticateToken, workAreaController.getWorkAreaById);
router.put('/:id', authenticateToken, workAreaController.updateWorkArea);
router.delete('/:id', authenticateToken, workAreaController.deleteWorkArea);

module.exports = router;
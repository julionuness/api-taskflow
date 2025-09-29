const express = require('express');
const router = express.Router();
const workAreaController = require('../controllers/WorkAreaController');
const { authenticateToken } = require('../middleware/auth');

// Rotas para áreas de trabalho
router.post('/', authenticateToken, workAreaController.createWorkArea);
router.put('/:id', authenticateToken, workAreaController.updateWorkArea);
router.delete('/:id', authenticateToken, workAreaController.deleteWorkArea);

// Rotas para gerenciar usuários em áreas de trabalho
router.get('/my-workareas', authenticateToken, workAreaController.getUserWorkAreas);
router.get('/:id/users', authenticateToken, workAreaController.getWorkAreaUsers);
router.post('/add-user', authenticateToken, workAreaController.addUserToWorkArea);
router.delete('/remove-user', authenticateToken, workAreaController.removeUserFromWorkArea);
router.put('/user-role/:id', authenticateToken, workAreaController.updateUserRole);

module.exports = router;
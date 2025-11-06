const workAreaService = require('../services/workAreaService');
const workAreaUserService = require('../services/WorkAreaUserService');
const ActivityLogService = require('../services/ActivityLogService');
const { HTTP_STATUS } = require('../utils/constants');

const activityLogService = new ActivityLogService();

const createWorkArea = async (req, res) => {
  try {
    const userId = req.user.id; // Pega o ID do usuário logado do middleware de autenticação
    const workAreaData = { ...req.body, userId };

    const result = await workAreaService.createWorkArea(workAreaData);

    res.status(HTTP_STATUS.CREATED).json({
      message: 'Área de trabalho criada com sucesso',
      ...result
    });
  } catch (error) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: error.message
    });
  }
};

const updateWorkArea = async (req, res) => {
  try {
    const { id } = req.params;
    const workAreaData = { ...req.body, id };

    const result = await workAreaService.updateWorkArea(workAreaData);

    res.status(HTTP_STATUS.OK).json({
      message: 'Área de trabalho atualizada com sucesso',
      ...result
    });
  } catch (error) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: error.message
    });
  }
};

const deleteWorkArea = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await workAreaService.deleteWorkArea({ id });

    res.status(HTTP_STATUS.OK).json({
      message: 'Área de trabalho deletada com sucesso',
      ...result
    });
  } catch (error) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: error.message
    });
  }
};

const getWorkAreaById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Getting work area by id:', id);
    const pool = require('../config/database');

    const query = 'SELECT id, title, created_at, updated_at FROM work_area WHERE id = $1';
    console.log('Executing query:', query, 'with id:', id);
    const result = await pool.query(query, [id]);
    console.log('Query result:', result.rows);

    if (result.rows.length === 0) {
      console.log('Work area not found');
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        error: 'Área de trabalho não encontrada'
      });
    }

    const response = {
      id: result.rows[0].id,
      title: result.rows[0].title,
      createdAt: result.rows[0].created_at,
      updatedAt: result.rows[0].updated_at
    };
    console.log('Sending response:', response);

    res.status(HTTP_STATUS.OK).json(response);
  } catch (error) {
    console.error('Get work area by id error:', error);
    console.error('Error stack:', error.stack);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      error: error.message
    });
  }
};

const getUserWorkAreas = async (req, res) => {
  try {
    const userId = req.user.id;
    const pool = require('../config/database');

    // Fazer JOIN para pegar as informações das work areas
    const query = `
      SELECT wa.id, wa.title, wau.is_manager
      FROM work_area_user wau
      INNER JOIN work_area wa ON wau.work_area_id = wa.id
      WHERE wau.user_id = $1
      ORDER BY wa.title
    `;

    const result = await pool.query(query, [userId]);

    res.status(HTTP_STATUS.OK).json(result.rows.map(row => ({
      id: row.id,
      title: row.title,
      isManager: row.is_manager
    })));
  } catch (error) {
    console.error('Get user work areas error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      error: error.message
    });
  }
};

const getWorkAreaUsers = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = require('../config/database');

    // Fazer JOIN para pegar as informações dos usuários
    const query = `
      SELECT u.id, u.name, u.email, wau.is_manager
      FROM work_area_user wau
      INNER JOIN users u ON wau.user_id = u.id
      WHERE wau.work_area_id = $1
      ORDER BY wau.is_manager DESC, u.name
    `;

    const result = await pool.query(query, [id]);

    res.status(HTTP_STATUS.OK).json(result.rows.map(row => ({
      id: row.id,
      name: row.name,
      email: row.email,
      isManager: row.is_manager
    })));
  } catch (error) {
    console.error('Get work area users error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      error: error.message
    });
  }
};

const addUserToWorkArea = async (req, res) => {
  try {
    const { workAreaId, userId, isManager = false } = req.body;
    const currentUserId = req.user.id;

    const result = await workAreaUserService.createWorkAreaUser({
      userId,
      workAreaId,
      isManager
    });

    // Buscar informações para o log
    const pool = require('../config/database');
    const userQuery = 'SELECT name FROM users WHERE id = $1';
    const workAreaQuery = 'SELECT title FROM work_area WHERE id = $1';

    const userResult = await pool.query(userQuery, [userId]);
    const workAreaResult = await pool.query(workAreaQuery, [workAreaId]);

    const addedUser = { id: userId, name: userResult.rows[0]?.name };
    const workAreaName = workAreaResult.rows[0]?.title;

    // Log da atividade
    await activityLogService.logUserAdded(workAreaId, currentUserId, addedUser, workAreaName);

    res.status(HTTP_STATUS.CREATED).json({
      message: 'Usuário adicionado à área de trabalho com sucesso',
      ...result
    });
  } catch (error) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: error.message
    });
  }
};

const removeUserFromWorkArea = async (req, res) => {
  try {
    const { userId, workAreaId } = req.body;
    const currentUserId = req.user.id;

    // Buscar informações antes de remover
    const pool = require('../config/database');
    const userQuery = 'SELECT name FROM users WHERE id = $1';
    const workAreaQuery = 'SELECT title FROM work_area WHERE id = $1';

    const userResult = await pool.query(userQuery, [userId]);
    const workAreaResult = await pool.query(workAreaQuery, [workAreaId]);

    const removedUser = { id: userId, name: userResult.rows[0]?.name };
    const workAreaName = workAreaResult.rows[0]?.title;

    const result = await workAreaUserService.removeUserFromWorkArea(userId, workAreaId);

    // Log da atividade
    await activityLogService.logUserRemoved(workAreaId, currentUserId, removedUser, workAreaName);

    res.status(HTTP_STATUS.OK).json({
      message: 'Usuário removido da área de trabalho com sucesso',
      ...result
    });
  } catch (error) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: error.message
    });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { isManager } = req.body;

    const result = await workAreaUserService.updateWorkAreaUser({ id, isManager });

    res.status(HTTP_STATUS.OK).json({
      message: 'Papel do usuário atualizado com sucesso',
      ...result
    });
  } catch (error) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: error.message
    });
  }
};

module.exports = {
  createWorkArea,
  getWorkAreaById,
  updateWorkArea,
  deleteWorkArea,
  getUserWorkAreas,
  getWorkAreaUsers,
  addUserToWorkArea,
  removeUserFromWorkArea,
  updateUserRole
};
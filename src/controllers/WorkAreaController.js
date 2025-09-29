const workAreaService = require('../services/workAreaService');
const workAreaUserService = require('../services/WorkAreaUserService');
const { HTTP_STATUS } = require('../utils/constants');

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

const getUserWorkAreas = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await workAreaUserService.getWorkAreasByUser(userId);

    res.status(HTTP_STATUS.OK).json(result);
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      error: error.message
    });
  }
};

const getWorkAreaUsers = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await workAreaUserService.getUsersByWorkArea(id);

    res.status(HTTP_STATUS.OK).json(result);
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      error: error.message
    });
  }
};

const addUserToWorkArea = async (req, res) => {
  try {
    const { workAreaId, userId, isManager = false } = req.body;

    const result = await workAreaUserService.createWorkAreaUser({
      userId,
      workAreaId,
      isManager
    });

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

    const result = await workAreaUserService.removeUserFromWorkArea(userId, workAreaId);

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
  updateWorkArea,
  deleteWorkArea,
  getUserWorkAreas,
  getWorkAreaUsers,
  addUserToWorkArea,
  removeUserFromWorkArea,
  updateUserRole
};
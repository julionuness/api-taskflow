const WorkAreaUserRepository = require('../repositories/WorkAreaUserRepository');

const workAreaUserRepository = new WorkAreaUserRepository();

const createWorkAreaUser = async (workAreaUserData) => {
  try {
    const { userId, workAreaId, isManager } = workAreaUserData;

    const workAreaUser = await workAreaUserRepository.create({
      userId,
      workAreaId,
      isManager
    });

    return {
      workAreaUser
    };
  } catch (error) {
    console.error('Create work area user service error:', error);
    throw error;
  }
};

const getWorkAreasByUser = async (userId) => {
  try {
    const workAreaUsers = await workAreaUserRepository.findByUserId(userId);

    return {
      workAreaUsers
    };
  } catch (error) {
    console.error('Get work areas by user service error:', error);
    throw error;
  }
};

const getUsersByWorkArea = async (workAreaId) => {
  try {
    const workAreaUsers = await workAreaUserRepository.findByWorkAreaId(workAreaId);

    return {
      workAreaUsers
    };
  } catch (error) {
    console.error('Get users by work area service error:', error);
    throw error;
  }
};

const updateWorkAreaUser = async (workAreaUserData) => {
  try {
    const { id, isManager } = workAreaUserData;

    const workAreaUser = await workAreaUserRepository.findById(id);
    if (!workAreaUser) {
      throw new Error('Relação usuário-área de trabalho não encontrada!');
    }

    const updatedWorkAreaUser = await workAreaUserRepository.update(id, { isManager });

    return {
      workAreaUser: updatedWorkAreaUser
    };
  } catch (error) {
    console.error('Update work area user service error:', error);
    throw error;
  }
};

const deleteWorkAreaUser = async (id) => {
  try {
    const workAreaUser = await workAreaUserRepository.findById(id);
    if (!workAreaUser) {
      throw new Error('Relação usuário-área de trabalho não encontrada!');
    }

    const deleted = await workAreaUserRepository.delete(id);

    return {
      deleted
    };
  } catch (error) {
    console.error('Delete work area user service error:', error);
    throw error;
  }
};

const removeUserFromWorkArea = async (userId, workAreaId) => {
  try {
    const deleted = await workAreaUserRepository.deleteByUserAndWorkArea(userId, workAreaId);

    return {
      deleted
    };
  } catch (error) {
    console.error('Remove user from work area service error:', error);
    throw error;
  }
};

module.exports = {
  createWorkAreaUser,
  getWorkAreasByUser,
  getUsersByWorkArea,
  updateWorkAreaUser,
  deleteWorkAreaUser,
  removeUserFromWorkArea
};
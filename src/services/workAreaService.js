const WorkAreaRepository = require('../repositories/WorkAreaRepository');
const WorkAreaUserRepository = require('../repositories/WorkAreaUserRepository');

const workAreaRepository = new WorkAreaRepository();
const workAreaUserRepository = new WorkAreaUserRepository();

const createWorkArea = async (workAreaData) => {
  try {
    const { title, userId } = workAreaData;

    const workArea = await workAreaRepository.create({
      title
    });

    // Automaticamente adiciona o criador como manager da área de trabalho
    const workAreaUser = await workAreaUserRepository.create({
      userId,
      workAreaId: workArea.id,
      isManager: true
    });

    return {
      workArea,
      workAreaUser
    };
  } catch (error) {
    console.error('Create service error:', error);
    throw error;
  }
};

const updateWorkArea = async (workAreaData) => {
  try {
    const { id, title } = workAreaData;

    const workArea = await workAreaRepository.findById(id);
    if (!workArea) {
      throw new Error('Área de trabalho não encontrada!');
    }

    const updateWorkArea = await workAreaRepository.update(id, workAreaData);

    return {
      workArea: workArea.toJSON(),
      updateWorkArea: updateWorkArea.toJSON(),
    };
  } catch (error) {
    console.error('Update service error:', error);
    throw error;
  }
};

const deleteWorkArea = async (id) => {
  try {
    const { id } = id;

    const workArea = await workAreaRepository.findById(id);
    if (!workArea) {
      throw new Error('Área de trabalho não encontrada!');
    }
    else{
      const deleting = await workAreaRepository.delete(id);
    }

    
    return {
      workArea: workArea.toJSON(),
      deleting: deleting.toJSON(),
    };
  } catch (error) {
    console.error('Delete service error:', error);
    throw error;
  }
};


module.exports = {
  createWorkArea,
  updateWorkArea,
  deleteWorkArea
};
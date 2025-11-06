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

const deleteWorkArea = async (workAreaData) => {
  const pool = require('../config/database');
  const client = await pool.connect();

  try {
    const { id } = workAreaData;

    await client.query('BEGIN');

    // Verificar se a área de trabalho existe
    const checkResult = await client.query('SELECT * FROM work_area WHERE id = $1', [id]);
    if (checkResult.rows.length === 0) {
      throw new Error('Área de trabalho não encontrada!');
    }

    // Deletar cards primeiro (tem FK para kanban_column)
    await client.query(`
      DELETE FROM kanban_card
      WHERE column_id IN (
        SELECT id FROM kanban_column WHERE work_area_id = $1
      )
    `, [id]);

    // Deletar colunas kanban
    await client.query('DELETE FROM kanban_column WHERE work_area_id = $1', [id]);

    // Deletar relacionamentos de usuários com a área de trabalho
    await client.query('DELETE FROM work_area_user WHERE work_area_id = $1', [id]);

    // Por fim, deletar a área de trabalho
    await client.query('DELETE FROM work_area WHERE id = $1', [id]);

    await client.query('COMMIT');

    return {
      success: true,
      deletedId: id
    };
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Delete service error:', error);
    throw error;
  } finally {
    client.release();
  }
};


module.exports = {
  createWorkArea,
  updateWorkArea,
  deleteWorkArea
};
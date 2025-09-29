const pool = require('../config/database');
const WorkAreaUser = require('../models/WorkAreaUser');

class WorkAreaUserRepository {
  async findById(id) {
    try {
      const query = 'SELECT * FROM work_area_user WHERE id = $1';
      const result = await pool.query(query, [id]);

      if (result.rows.length === 0) {
        return null;
      }

      const workAreaUserData = result.rows[0];
      return new WorkAreaUser(
        workAreaUserData.id,
        workAreaUserData.user_id,
        workAreaUserData.work_area_id,
        workAreaUserData.is_manager
      );
    } catch (error) {
      console.error('Error finding work area user by id:', error);
      throw error;
    }
  }

  async findByUserId(userId) {
    try {
      const query = 'SELECT * FROM work_area_user WHERE user_id = $1';
      const result = await pool.query(query, [userId]);

      return result.rows.map(row => new WorkAreaUser(
        row.id,
        row.user_id,
        row.work_area_id,
        row.is_manager
      ));
    } catch (error) {
      console.error('Error finding work areas by user id:', error);
      throw error;
    }
  }

  async findByWorkAreaId(workAreaId) {
    try {
      const query = 'SELECT * FROM work_area_user WHERE work_area_id = $1';
      const result = await pool.query(query, [workAreaId]);

      return result.rows.map(row => new WorkAreaUser(
        row.id,
        row.user_id,
        row.work_area_id,
        row.is_manager
      ));
    } catch (error) {
      console.error('Error finding users by work area id:', error);
      throw error;
    }
  }

  async create(workAreaUserData) {
    try {
      const { userId, workAreaId, isManager } = workAreaUserData;
      const query = `
        INSERT INTO work_area_user (user_id, work_area_id, is_manager)
        VALUES ($1, $2, $3)
        RETURNING *
      `;
      const result = await pool.query(query, [userId, workAreaId, isManager]);
      const newWorkAreaUserData = result.rows[0];

      return new WorkAreaUser(
        newWorkAreaUserData.id,
        newWorkAreaUserData.user_id,
        newWorkAreaUserData.work_area_id,
        newWorkAreaUserData.is_manager
      );
    } catch (error) {
      console.error('Error creating work area user:', error);
      throw error;
    }
  }

  async update(id, workAreaUserData) {
    try {
      const fields = [];
      const values = [];
      let paramCount = 1;

      if (workAreaUserData.isManager !== undefined) {
        fields.push(`is_manager = $${paramCount}`);
        values.push(workAreaUserData.isManager);
        paramCount++;
      }

      if (fields.length === 0) {
        throw new Error('No fields to update');
      }

      values.push(id);

      const query = `
        UPDATE work_area_user
        SET ${fields.join(', ')}
        WHERE id = $${paramCount}
        RETURNING *
      `;

      const result = await pool.query(query, values);

      if (result.rows.length === 0) {
        return null;
      }

      const updatedWorkAreaUserData = result.rows[0];
      return new WorkAreaUser(
        updatedWorkAreaUserData.id,
        updatedWorkAreaUserData.user_id,
        updatedWorkAreaUserData.work_area_id,
        updatedWorkAreaUserData.is_manager
      );
    } catch (error) {
      console.error('Error updating work area user:', error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const query = 'DELETE FROM work_area_user WHERE id = $1 RETURNING *';
      const result = await pool.query(query, [id]);

      return result.rows.length > 0;
    } catch (error) {
      console.error('Error deleting work area user:', error);
      throw error;
    }
  }

  async deleteByUserAndWorkArea(userId, workAreaId) {
    try {
      const query = 'DELETE FROM work_area_user WHERE user_id = $1 AND work_area_id = $2 RETURNING *';
      const result = await pool.query(query, [userId, workAreaId]);

      return result.rows.length > 0;
    } catch (error) {
      console.error('Error deleting work area user by user and work area:', error);
      throw error;
    }
  }
}

module.exports = WorkAreaUserRepository;
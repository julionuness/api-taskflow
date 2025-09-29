const pool = require('../config/database');
const WorkArea = require('../models/WorkArea');

class WorkAreaRepository {
  async findById(id) {
    try {
      const query = 'SELECT * FROM work_area WHERE id = $1';
      const result = await pool.query(query, [id]);

      if (result.rows.length === 0) {
        return null;
      }

      const workAreaData = result.rows[0];
      return new WorkArea(
        workAreaData.id,
        workAreaData.title
      );
    } catch (error) {
      console.error('Error finding work area by id:', error);
      throw error;
    }
  }

  async create(workAreaData) {
    try {
      const { title } = workAreaData;
      const query = `
        INSERT INTO work_area (title)
        VALUES ($1)
        RETURNING *
      `;
      const result = await pool.query(query, [title]);
      const newWorkAreaData = result.rows[0];

      return new WorkArea(
        newWorkAreaData.id,
        newWorkAreaData.title
        
      );
    } catch (error) {
      console.error('Error creating work area:', error);
      throw error;
    }
  }

  async update(id, workAreaData) {
    try {
      const fields = [];
      const values = [];
      let paramCount = 1;

      Object.keys(workAreaData).forEach(key => {
        if (workAreaData[key] !== undefined) {
          fields.push(`${key} = $${paramCount}`);
          values.push(workAreaData[key]);
          paramCount++;
        }
      });

      if (fields.length === 0) {
        throw new Error('No fields to update');
      }

      values.push(id);

      const query = `
        UPDATE work_area
        SET ${fields.join(', ')}
        WHERE id = $${paramCount}
        RETURNING *
      `;

      const result = await pool.query(query, values);

      if (result.rows.length === 0) {
        return null;
      }

      const updatedWorkAreaData = result.rows[0];
      return new WorkArea(
        updatedWorkAreaData.id,
        updatedWorkAreaData.title
      );
    } catch (error) {
      console.error('Error updating work area:', error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const query = 'DELETE FROM work area WHERE id = $1 RETURNING *';
      const result = await pool.query(query, [id]);

      return result.rows.length > 0;
    } catch (error) {
      console.error('Error deleting work area:', error);
      throw error;
    }
  }
}

module.exports = WorkAreaRepository;
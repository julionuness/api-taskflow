const pool = require('../config/database');
const KanbanColumn = require('../models/KanbanColumn');

class KanbanColumnRepository {
  async findById(id) {
    try {
      const query = 'SELECT * FROM kanban_column WHERE id = $1';
      const result = await pool.query(query, [id]);

      if (result.rows.length === 0) {
        return null;
      }

      const col = result.rows[0];
      return new KanbanColumn(
        col.id,
        col.work_area_id,
        col.title,
        col.position,
        col.created_at,
        col.updated_at
      );
    } catch (error) {
      console.error('Error finding kanban column by id:', error);
      throw error;
    }
  }

  async findByWorkAreaId(workAreaId) {
    try {
      const query = 'SELECT * FROM kanban_column WHERE work_area_id = $1 ORDER BY position';
      const result = await pool.query(query, [workAreaId]);

      return result.rows.map(col => new KanbanColumn(
        col.id,
        col.work_area_id,
        col.title,
        col.position,
        col.created_at,
        col.updated_at
      ));
    } catch (error) {
      console.error('Error finding columns by work area:', error);
      throw error;
    }
  }

  async create(columnData) {
    try {
      const { workAreaId, title, position } = columnData;
      const query = `
        INSERT INTO kanban_column (work_area_id, title, position)
        VALUES ($1, $2, $3)
        RETURNING *
      `;
      const result = await pool.query(query, [workAreaId, title, position]);
      const col = result.rows[0];

      return new KanbanColumn(
        col.id,
        col.work_area_id,
        col.title,
        col.position,
        col.created_at,
        col.updated_at
      );
    } catch (error) {
      console.error('Error creating kanban column:', error);
      throw error;
    }
  }

  async update(id, columnData) {
    try {
      const fields = [];
      const values = [];
      let paramCount = 1;

      if (columnData.title !== undefined) {
        fields.push(`title = $${paramCount}`);
        values.push(columnData.title);
        paramCount++;
      }

      if (columnData.position !== undefined) {
        fields.push(`position = $${paramCount}`);
        values.push(columnData.position);
        paramCount++;
      }

      fields.push(`updated_at = CURRENT_TIMESTAMP`);

      if (fields.length === 0) {
        throw new Error('No fields to update');
      }

      values.push(id);

      const query = `
        UPDATE kanban_column
        SET ${fields.join(', ')}
        WHERE id = $${paramCount}
        RETURNING *
      `;

      const result = await pool.query(query, values);

      if (result.rows.length === 0) {
        return null;
      }

      const col = result.rows[0];
      return new KanbanColumn(
        col.id,
        col.work_area_id,
        col.title,
        col.position,
        col.created_at,
        col.updated_at
      );
    } catch (error) {
      console.error('Error updating kanban column:', error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const query = 'DELETE FROM kanban_column WHERE id = $1 RETURNING *';
      const result = await pool.query(query, [id]);
      return result.rows.length > 0;
    } catch (error) {
      console.error('Error deleting kanban column:', error);
      throw error;
    }
  }

  async updatePositions(updates) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      for (const update of updates) {
        const query = 'UPDATE kanban_column SET position = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2';
        await client.query(query, [update.position, update.id]);
      }

      await client.query('COMMIT');
      return true;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error updating column positions:', error);
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = KanbanColumnRepository;

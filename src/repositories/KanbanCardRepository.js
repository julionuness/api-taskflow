const pool = require('../config/database');
const KanbanCard = require('../models/KanbanCard');

class KanbanCardRepository {
  async findById(id) {
    try {
      const query = 'SELECT * FROM kanban_card WHERE id = $1';
      const result = await pool.query(query, [id]);

      if (result.rows.length === 0) {
        return null;
      }

      const card = result.rows[0];
      return new KanbanCard(
        card.id,
        card.column_id,
        card.title,
        card.description,
        card.position,
        card.priority,
        card.assigned_user_id,
        card.due_date,
        card.created_at,
        card.updated_at
      );
    } catch (error) {
      console.error('Error finding kanban card by id:', error);
      throw error;
    }
  }

  async findByColumnId(columnId) {
    try {
      const query = 'SELECT * FROM kanban_card WHERE column_id = $1 ORDER BY position';
      const result = await pool.query(query, [columnId]);

      return result.rows.map(card => new KanbanCard(
        card.id,
        card.column_id,
        card.title,
        card.description,
        card.position,
        card.priority,
        card.assigned_user_id,
        card.created_at,
        card.updated_at
      ));
    } catch (error) {
      console.error('Error finding cards by column:', error);
      throw error;
    }
  }

  async findByWorkAreaId(workAreaId) {
    try {
      const query = `
        SELECT kc.*
        FROM kanban_card kc
        INNER JOIN kanban_column kcol ON kc.column_id = kcol.id
        WHERE kcol.work_area_id = $1
        ORDER BY kc.column_id, kc.position
      `;
      const result = await pool.query(query, [workAreaId]);

      return result.rows.map(card => new KanbanCard(
        card.id,
        card.column_id,
        card.title,
        card.description,
        card.position,
        card.priority,
        card.assigned_user_id,
        card.created_at,
        card.updated_at
      ));
    } catch (error) {
      console.error('Error finding cards by work area:', error);
      throw error;
    }
  }

  async create(cardData) {
    try {
      const { columnId, title, description, position, priority = 'baixa', assignedUserId = null, dueDate = null } = cardData;
      const query = `
        INSERT INTO kanban_card (column_id, title, description, position, priority, assigned_user_id, due_date)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `;
      const result = await pool.query(query, [columnId, title, description || null, position, priority, assignedUserId, dueDate]);
      const card = result.rows[0];

      return new KanbanCard(
        card.id,
        card.column_id,
        card.title,
        card.description,
        card.position,
        card.priority,
        card.assigned_user_id,
        card.due_date,
        card.created_at,
        card.updated_at
      );
    } catch (error) {
      console.error('Error creating kanban card:', error);
      throw error;
    }
  }

  async update(id, cardData) {
    try {
      const fields = [];
      const values = [];
      let paramCount = 1;

      if (cardData.title !== undefined) {
        fields.push(`title = $${paramCount}`);
        values.push(cardData.title);
        paramCount++;
      }

      if (cardData.description !== undefined) {
        fields.push(`description = $${paramCount}`);
        values.push(cardData.description);
        paramCount++;
      }

      if (cardData.columnId !== undefined) {
        fields.push(`column_id = $${paramCount}`);
        values.push(cardData.columnId);
        paramCount++;
      }

      if (cardData.position !== undefined) {
        fields.push(`position = $${paramCount}`);
        values.push(cardData.position);
        paramCount++;
      }

      if (cardData.priority !== undefined) {
        fields.push(`priority = $${paramCount}`);
        values.push(cardData.priority);
        paramCount++;
      }

      if (cardData.assignedUserId !== undefined) {
        fields.push(`assigned_user_id = $${paramCount}`);
        values.push(cardData.assignedUserId);
        paramCount++;
      }

      if (cardData.dueDate !== undefined) {
        fields.push(`due_date = $${paramCount}`);
        values.push(cardData.dueDate);
        paramCount++;
      }

      fields.push(`updated_at = CURRENT_TIMESTAMP`);

      if (fields.length === 0) {
        throw new Error('No fields to update');
      }

      values.push(id);

      const query = `
        UPDATE kanban_card
        SET ${fields.join(', ')}
        WHERE id = $${paramCount}
        RETURNING *
      `;

      const result = await pool.query(query, values);

      if (result.rows.length === 0) {
        return null;
      }

      const card = result.rows[0];
      return new KanbanCard(
        card.id,
        card.column_id,
        card.title,
        card.description,
        card.position,
        card.priority,
        card.assigned_user_id,
        card.due_date,
        card.created_at,
        card.updated_at
      );
    } catch (error) {
      console.error('Error updating kanban card:', error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const query = 'DELETE FROM kanban_card WHERE id = $1 RETURNING *';
      const result = await pool.query(query, [id]);
      return result.rows.length > 0;
    } catch (error) {
      console.error('Error deleting kanban card:', error);
      throw error;
    }
  }

  async updatePositions(updates) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      for (const update of updates) {
        const query = 'UPDATE kanban_card SET column_id = $1, position = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3';
        await client.query(query, [update.columnId, update.position, update.id]);
      }

      await client.query('COMMIT');
      return true;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error updating card positions:', error);
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = KanbanCardRepository;

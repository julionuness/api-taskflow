const pool = require('../config/database');

class ActivityLogRepository {
  async create({ workAreaId, userId, actionType, entityType, entityId, entityName, description, metadata }) {
    const query = `
      INSERT INTO activity_log
      (work_area_id, user_id, action_type, entity_type, entity_id, entity_name, description, metadata)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

    const values = [
      workAreaId,
      userId,
      actionType,
      entityType,
      entityId || null,
      entityName || null,
      description,
      metadata ? JSON.stringify(metadata) : null
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async findByWorkArea(workAreaId, limit = 50, offset = 0) {
    const query = `
      SELECT
        al.*,
        u.name as user_name,
        u.email as user_email
      FROM activity_log al
      INNER JOIN users u ON al.user_id = u.id
      WHERE al.work_area_id = $1
      ORDER BY al.created_at DESC
      LIMIT $2 OFFSET $3
    `;

    const result = await pool.query(query, [workAreaId, limit, offset]);
    return result.rows;
  }

  async countByWorkArea(workAreaId) {
    const query = 'SELECT COUNT(*) FROM activity_log WHERE work_area_id = $1';
    const result = await pool.query(query, [workAreaId]);
    return parseInt(result.rows[0].count);
  }

  async findByEntity(entityType, entityId, limit = 20) {
    const query = `
      SELECT
        al.*,
        u.name as user_name,
        u.email as user_email
      FROM activity_log al
      INNER JOIN users u ON al.user_id = u.id
      WHERE al.entity_type = $1 AND al.entity_id = $2
      ORDER BY al.created_at DESC
      LIMIT $3
    `;

    const result = await pool.query(query, [entityType, entityId, limit]);
    return result.rows;
  }

  async deleteByWorkArea(workAreaId) {
    const query = 'DELETE FROM activity_log WHERE work_area_id = $1';
    await pool.query(query, [workAreaId]);
  }

  async getRecentActivity(workAreaId, hours = 24) {
    const query = `
      SELECT
        al.*,
        u.name as user_name,
        u.email as user_email
      FROM activity_log al
      INNER JOIN users u ON al.user_id = u.id
      WHERE al.work_area_id = $1
        AND al.created_at >= NOW() - INTERVAL '${hours} hours'
      ORDER BY al.created_at DESC
    `;

    const result = await pool.query(query, [workAreaId]);
    return result.rows;
  }

  async getActivityStats(workAreaId, days = 7) {
    const query = `
      SELECT
        DATE(created_at) as date,
        action_type,
        entity_type,
        COUNT(*) as count
      FROM activity_log
      WHERE work_area_id = $1
        AND created_at >= NOW() - INTERVAL '${days} days'
      GROUP BY DATE(created_at), action_type, entity_type
      ORDER BY date DESC
    `;

    const result = await pool.query(query, [workAreaId]);
    return result.rows;
  }
}

module.exports = ActivityLogRepository;

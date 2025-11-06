const pool = require('../config/database');
const Notification = require('../models/Notification');

class NotificationRepository {
  async findById(id) {
    try {
      const query = 'SELECT * FROM notification WHERE id = $1';
      const result = await pool.query(query, [id]);

      if (result.rows.length === 0) {
        return null;
      }

      const notification = result.rows[0];
      return new Notification(
        notification.id,
        notification.card_id,
        notification.user_id,
        notification.type,
        notification.message,
        notification.is_read,
        notification.created_at
      );
    } catch (error) {
      console.error('Error finding notification by id:', error);
      throw error;
    }
  }

  async findByUserId(userId, includeRead = false) {
    try {
      let query = `
        SELECT n.*, kc.title as card_title, kc.due_date
        FROM notification n
        INNER JOIN kanban_card kc ON n.card_id = kc.id
        WHERE n.user_id = $1
      `;

      if (!includeRead) {
        query += ' AND n.is_read = false';
      }

      query += ' ORDER BY n.created_at DESC';

      const result = await pool.query(query, [userId]);

      return result.rows.map(notification => ({
        ...new Notification(
          notification.id,
          notification.card_id,
          notification.user_id,
          notification.type,
          notification.message,
          notification.is_read,
          notification.created_at
        ).toJSON(),
        cardTitle: notification.card_title,
        dueDate: notification.due_date
      }));
    } catch (error) {
      console.error('Error finding notifications by user:', error);
      throw error;
    }
  }

  async create(notificationData) {
    try {
      const { cardId, userId, type, message } = notificationData;
      const query = `
        INSERT INTO notification (card_id, user_id, type, message)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;
      const result = await pool.query(query, [cardId, userId, type, message]);
      const notification = result.rows[0];

      return new Notification(
        notification.id,
        notification.card_id,
        notification.user_id,
        notification.type,
        notification.message,
        notification.is_read,
        notification.created_at
      );
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  async markAsRead(id) {
    try {
      const query = 'UPDATE notification SET is_read = true WHERE id = $1 RETURNING *';
      const result = await pool.query(query, [id]);

      if (result.rows.length === 0) {
        return null;
      }

      const notification = result.rows[0];
      return new Notification(
        notification.id,
        notification.card_id,
        notification.user_id,
        notification.type,
        notification.message,
        notification.is_read,
        notification.created_at
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  async markAllAsReadByUser(userId) {
    try {
      const query = 'UPDATE notification SET is_read = true WHERE user_id = $1 AND is_read = false';
      await pool.query(query, [userId]);
      return true;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  async countUnreadByUser(userId) {
    try {
      const query = 'SELECT COUNT(*) as count FROM notification WHERE user_id = $1 AND is_read = false';
      const result = await pool.query(query, [userId]);
      return parseInt(result.rows[0].count);
    } catch (error) {
      console.error('Error counting unread notifications:', error);
      throw error;
    }
  }

  async checkIfNotificationExists(cardId, userId, type) {
    try {
      const query = 'SELECT id FROM notification WHERE card_id = $1 AND user_id = $2 AND type = $3';
      const result = await pool.query(query, [cardId, userId, type]);
      return result.rows.length > 0;
    } catch (error) {
      console.error('Error checking notification existence:', error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const query = 'DELETE FROM notification WHERE id = $1 RETURNING *';
      const result = await pool.query(query, [id]);
      return result.rows.length > 0;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }
}

module.exports = NotificationRepository;

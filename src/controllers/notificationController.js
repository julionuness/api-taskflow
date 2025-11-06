const NotificationService = require('../services/notificationService');
const { HTTP_STATUS } = require('../utils/constants');

const notificationService = new NotificationService();

const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const includeRead = req.query.includeRead === 'true';

    const result = await notificationService.getUserNotifications(userId, includeRead);

    res.status(HTTP_STATUS.OK).json(result);
  } catch (error) {
    console.error('Get user notifications error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      error: error.message
    });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await notificationService.markNotificationAsRead(id);

    if (!notification) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        error: 'Notificação não encontrada'
      });
    }

    res.status(HTTP_STATUS.OK).json({
      message: 'Notificação marcada como lida',
      notification
    });
  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: error.message
    });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await notificationService.markAllAsRead(userId);

    res.status(HTTP_STATUS.OK).json(result);
  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: error.message
    });
  }
};

const generateNotifications = async (req, res) => {
  try {
    console.log('🔔 Generating notifications manually...');
    const result = await notificationService.generateNotificationsForAllCards();

    console.log(`✅ Manual generation completed:
      - Cards processed: ${result.cardsProcessed}
      - Notifications created: ${result.totalNotificationsCreated}
    `);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Notificações geradas com sucesso',
      ...result
    });
  } catch (error) {
    console.error('Generate notifications error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      error: error.message
    });
  }
};

const testEmail = async (req, res) => {
  try {
    const user = req.user; // Usuário autenticado

    const EmailService = require('../services/emailService');
    const emailService = new EmailService();

    // Verificar conexão
    const isConnected = await emailService.verifyConnection();
    if (!isConnected) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: 'Email service not configured properly. Check your .env file.'
      });
    }

    // Enviar email de teste
    const result = await emailService.sendTestEmail(user.email, user.name);

    if (result.success) {
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: `Email de teste enviado para ${user.email}`,
        ...result
      });
    } else {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Test email error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      error: error.message
    });
  }
};

const clearAllNotifications = async (req, res) => {
  try {
    console.log('🗑️  Clearing all notifications...');
    const pool = require('../config/database');

    const result = await pool.query('DELETE FROM notification');

    console.log(`✅ Deleted ${result.rowCount} notifications`);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: `${result.rowCount} notificações deletadas`,
      deletedCount: result.rowCount
    });
  } catch (error) {
    console.error('Clear notifications error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      error: error.message
    });
  }
};

module.exports = {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  generateNotifications,
  testEmail,
  clearAllNotifications
};

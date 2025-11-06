const NotificationRepository = require('../repositories/NotificationRepository');
const KanbanCardRepository = require('../repositories/KanbanCardRepository');
const UserRepository = require('../repositories/UserRepository');
const EmailService = require('./emailService');

class NotificationService {
  constructor() {
    this.notificationRepository = new NotificationRepository();
    this.kanbanCardRepository = new KanbanCardRepository();
    this.userRepository = new UserRepository();
    this.emailService = new EmailService();
  }

  async generateNotificationsForCard(cardId) {
    try {
      const card = await this.kanbanCardRepository.findById(cardId);

      if (!card || !card.dueDate || !card.assignedUserId) {
        return { success: false, message: 'Card não tem data de entrega ou usuário atribuído' };
      }

      // Buscar dados do usuário para enviar email
      const user = await this.userRepository.findById(card.assignedUserId);
      if (!user) {
        console.error('User not found for card notification');
      }

      const dueDate = new Date(card.dueDate);
      const now = new Date();

      // Normalizar datas para comparação (apenas dia/mês/ano, sem horas)
      const dueDateOnly = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
      const nowOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      // Calcular diferença em dias
      const diffTime = dueDateOnly.getTime() - nowOnly.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      const notifications = [];

      // Determinar qual notificação enviar baseado na diferença de dias
      let notificationType = null;
      let message = '';

      if (diffDays === 0) {
        // Vence hoje
        notificationType = 'due_today';
        message = `O card "${card.title}" vence hoje!`;
      } else if (diffDays === 1) {
        // Vence amanhã
        notificationType = 'one_day';
        message = `O card "${card.title}" vence amanhã (${dueDate.toLocaleDateString('pt-BR')})`;
      } else if (diffDays === 2) {
        // Vence em 2 dias
        notificationType = 'two_days';
        message = `O card "${card.title}" vence em 2 dias (${dueDate.toLocaleDateString('pt-BR')})`;
      } else if (diffDays >= 3 && diffDays <= 7) {
        // Vence entre 3 e 7 dias - enviar notificação de 1 semana
        notificationType = 'one_week';
        message = `O card "${card.title}" vence em ${diffDays} dias (${dueDate.toLocaleDateString('pt-BR')})`;
      } else if (diffDays > 7) {
        // Mais de 1 semana - não enviar nada ainda
        notificationType = null;
      } else {
        // Já passou da data (diffDays < 0) - não enviar
        notificationType = null;
      }

      // Criar e enviar notificação se necessário
      if (notificationType) {
        const exists = await this.notificationRepository.checkIfNotificationExists(
          cardId,
          card.assignedUserId,
          notificationType
        );

        if (!exists) {
          const notification = await this.notificationRepository.create({
            cardId,
            userId: card.assignedUserId,
            type: notificationType,
            message: message
          });
          notifications.push(notification);

          // Enviar email
          if (user) {
            await this.sendNotificationEmail(notification, card, user);
          }
        }
      }

      return {
        success: true,
        notificationsCreated: notifications.length,
        notifications
      };
    } catch (error) {
      console.error('Error generating notifications:', error);
      throw error;
    }
  }

  async generateNotificationsForAllCards() {
    try {
      const pool = require('../config/database');

      // Buscar todos os cards com data de entrega e usuário atribuído
      const query = `
        SELECT id FROM kanban_card
        WHERE due_date IS NOT NULL
        AND assigned_user_id IS NOT NULL
        AND due_date >= CURRENT_DATE
      `;
      const result = await pool.query(query);

      const allNotifications = [];
      for (const card of result.rows) {
        const notifications = await this.generateNotificationsForCard(card.id);
        if (notifications.success) {
          allNotifications.push(...notifications.notifications);
        }
      }

      return {
        success: true,
        totalNotificationsCreated: allNotifications.length,
        cardsProcessed: result.rows.length
      };
    } catch (error) {
      console.error('Error generating notifications for all cards:', error);
      throw error;
    }
  }

  async getUserNotifications(userId, includeRead = false) {
    try {
      const notifications = await this.notificationRepository.findByUserId(userId, includeRead);
      const unreadCount = await this.notificationRepository.countUnreadByUser(userId);

      return {
        notifications,
        unreadCount
      };
    } catch (error) {
      console.error('Error getting user notifications:', error);
      throw error;
    }
  }

  async markNotificationAsRead(notificationId) {
    try {
      const notification = await this.notificationRepository.markAsRead(notificationId);
      return notification;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  async markAllAsRead(userId) {
    try {
      await this.notificationRepository.markAllAsReadByUser(userId);
      return { success: true, message: 'Todas as notificações foram marcadas como lidas' };
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  async sendNotificationEmail(notification, card, user) {
    try {
      const emailData = {
        cardTitle: card.title,
        dueDate: card.dueDate,
        type: notification.type,
        message: notification.message,
      };

      const result = await this.emailService.sendNotificationEmail(
        emailData,
        user.email,
        user.name
      );

      if (result.success) {
        console.log(`✅ Email sent to ${user.email} for notification ${notification.id}`);
      } else {
        console.error(`❌ Failed to send email to ${user.email}:`, result.error);
      }

      return result;
    } catch (error) {
      console.error('Error sending notification email:', error);
      // Não lançar erro para não interromper o fluxo de criação de notificações
      return { success: false, error: error.message };
    }
  }
}

module.exports = NotificationService;

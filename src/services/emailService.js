const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  initializeTransporter() {
    try {
      // Configuração do transporter
      this.transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: process.env.EMAIL_SECURE === 'true', // true para porta 465, false para outras portas
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      console.log('✅ Email service initialized');
    } catch (error) {
      console.error('❌ Error initializing email service:', error);
    }
  }

  async verifyConnection() {
    try {
      if (!this.transporter) {
        throw new Error('Email transporter not initialized');
      }

      await this.transporter.verify();
      console.log('✅ Email server is ready to send messages');
      return true;
    } catch (error) {
      console.error('❌ Email server verification failed:', error.message);
      return false;
    }
  }

  getNotificationEmailTemplate(notification, userEmail, userName) {
    const { cardTitle, dueDate, type, message } = notification;

    // Cores e configurações baseadas no tipo de notificação
    const configs = {
      due_today: {
        gradient: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
        accentColor: '#dc2626',
        icon: '!',
        iconBg: '#fee2e2',
        urgency: 'URGENTE'
      },
      one_day: {
        gradient: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
        accentColor: '#ea580c',
        icon: '⟳',
        iconBg: '#fed7aa',
        urgency: 'ALTA PRIORIDADE'
      },
      two_days: {
        gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        accentColor: '#f59e0b',
        icon: '◷',
        iconBg: '#fef3c7',
        urgency: 'ATENÇÃO'
      },
      one_week: {
        gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        accentColor: '#3b82f6',
        icon: '◉',
        iconBg: '#dbeafe',
        urgency: 'LEMBRETE'
      },
    };

    const config = configs[type] || configs.one_week;
    const formattedDate = new Date(dueDate).toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    const daysUntil = Math.ceil((new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24));
    const timeText = daysUntil === 0 ? 'Hoje' : daysUntil === 1 ? 'Amanhã' : `Em ${daysUntil} dias`;

    return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Notificação - TaskFlow</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5; min-height: 100vh;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 60px 20px;">
        <table role="presentation" style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">

          <!-- Header com Gradient -->
          <tr>
            <td style="padding: 0; background: ${config.gradient};">
              <div style="padding: 40px 40px 30px;">
                <table role="presentation" style="width: 100%;">
                  <tr>
                    <td style="text-align: left; vertical-align: middle;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">
                        TaskFlow
                      </h1>
                    </td>
                    <td style="text-align: right; vertical-align: middle;">
                      <span style="display: inline-block; background-color: rgba(255,255,255,0.2); color: #ffffff; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding: 6px 12px; border-radius: 20px;">
                        ${config.urgency}
                      </span>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>

          <!-- Saudação -->
          <tr>
            <td style="padding: 25px 40px 0; background-color: #ffffff;">
              <p style="margin: 0; color: #1f2937 !important; font-size: 18px; font-weight: 600;">
                Olá, ${userName}! 👋
              </p>
            </td>
          </tr>

          <!-- Mensagem Principal -->
          <tr>
            <td style="padding: 15px 40px; background-color: #ffffff;">
              <p style="margin: 0; color: #4b5563 !important; font-size: 15px; line-height: 1.6;">
                ${message}
              </p>
            </td>
          </tr>

          <!-- Card da Tarefa -->
          <tr>
            <td style="padding: 25px 40px;">
              <div style="background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%); border-radius: 12px; border: 2px solid ${config.accentColor}; overflow: hidden;">
                <!-- Badge de Prazo -->
                <div style="background-color: ${config.accentColor}; padding: 12px 20px;">
                  <table role="presentation" style="width: 100%;">
                    <tr>
                      <td style="color: #ffffff; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                        Prazo de Entrega
                      </td>
                      <td style="text-align: right; color: #ffffff; font-size: 16px; font-weight: 700;">
                        ${timeText}
                      </td>
                    </tr>
                  </table>
                </div>

                <!-- Conteúdo do Card -->
                <div style="padding: 24px; background-color: #ffffff;">
                  <p style="margin: 0 0 8px 0; color: #6b7280 !important; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
                    Tarefa
                  </p>
                  <h2 style="margin: 0 0 20px 0; color: #000000 !important; font-size: 22px; font-weight: 700; line-height: 1.3;">
                    ${cardTitle}
                  </h2>

                  <table role="presentation" style="width: 100%; border-top: 1px solid #e5e7eb; padding-top: 16px;">
                    <tr>
                      <td style="padding: 8px 0;">
                        <p style="margin: 0; color: #6b7280 !important; font-size: 13px; font-weight: 600;">
                          📅 Data completa
                        </p>
                        <p style="margin: 4px 0 0 0; color: #000000 !important; font-size: 15px; font-weight: 600; text-transform: capitalize;">
                          ${formattedDate}
                        </p>
                      </td>
                    </tr>
                  </table>
                </div>
              </div>
            </td>
          </tr>

          <!-- Call to Action -->
          <tr>
            <td style="padding: 10px 40px 40px; text-align: center; background-color: #ffffff;">
              <p style="margin: 0 0 20px 0; color: #6b7280 !important; font-size: 14px;">
                Acesse o TaskFlow para visualizar detalhes completos
              </p>
              <a href="#" style="display: inline-block; background: ${config.gradient}; color: #ffffff !important; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                Abrir TaskFlow
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
              <table role="presentation" style="width: 100%;">
                <tr>
                  <td style="text-align: center;">
                    <p style="margin: 0 0 8px 0; color: #9ca3af; font-size: 12px; line-height: 1.6;">
                      Este é um e-mail automático. Por favor, não responda.
                    </p>
                    <p style="margin: 0; color: #d1d5db; font-size: 11px;">
                      © ${new Date().getFullYear()} TaskFlow • Todos os direitos reservados
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;
  }

  async sendNotificationEmail(notification, userEmail, userName) {
    try {
      if (!this.transporter) {
        console.error('Email transporter not initialized');
        return { success: false, error: 'Email service not configured' };
      }

      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn('Email credentials not configured. Skipping email send.');
        return { success: false, error: 'Email credentials not configured' };
      }

      const htmlContent = this.getNotificationEmailTemplate(notification, userEmail, userName);

      const mailOptions = {
        from: `"${process.env.EMAIL_FROM_NAME || 'TaskFlow'}" <${process.env.EMAIL_FROM_ADDRESS || process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: `🔔 TaskFlow: ${notification.message}`,
        html: htmlContent,
        text: `${notification.message}\n\nTarefa: ${notification.cardTitle}\nData de Entrega: ${new Date(notification.dueDate).toLocaleDateString('pt-BR')}\n\nAcesse o TaskFlow para mais detalhes.`,
      };

      const info = await this.transporter.sendMail(mailOptions);

      console.log(`✅ Email sent successfully to ${userEmail}:`, info.messageId);

      return {
        success: true,
        messageId: info.messageId,
        accepted: info.accepted,
        rejected: info.rejected,
      };
    } catch (error) {
      console.error('❌ Error sending email:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async sendBulkNotifications(notifications) {
    const results = [];

    for (const notification of notifications) {
      const result = await this.sendNotificationEmail(
        notification,
        notification.userEmail,
        notification.userName
      );

      results.push({
        notificationId: notification.id,
        email: notification.userEmail,
        ...result,
      });
    }

    return results;
  }

  async sendTestEmail(toEmail, toName = 'Usuário') {
    try {
      const testNotification = {
        cardTitle: 'Tarefa de Teste',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
        type: 'one_week',
        message: 'Este é um email de teste do TaskFlow',
      };

      return await this.sendNotificationEmail(testNotification, toEmail, toName);
    } catch (error) {
      console.error('Error sending test email:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = EmailService;

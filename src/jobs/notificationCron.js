const cron = require('node-cron');
const NotificationService = require('../services/notificationService');

const notificationService = new NotificationService();

// Verificar se o email está configurado
const isEmailConfigured = process.env.EMAIL_USER && process.env.EMAIL_PASS;

if (!isEmailConfigured) {
  console.warn('⚠️  Email not configured. Notification cron job will not send emails.');
}

// Executar todos os dias às 9h da manhã (horário do servidor)
// Formato: segundo minuto hora dia mês dia-da-semana
// '0 9 * * *' = 9h todos os dias
// const cronSchedule = '0 9 * * *';

// Para desenvolvimento/teste: executar a cada 1 minuto
// ATENÇÃO: Comente a linha acima e descomente esta para testar
const cronSchedule = '*/1 * * * *'; // A cada 1 minuto (TESTE)

console.log(`📅 Notification cron job scheduled to run at 9:00 AM daily`);
console.log(`📧 Email configured: ${isEmailConfigured ? 'YES' : 'NO'}`);

const notificationCronJob = cron.schedule(cronSchedule, async () => {
  const now = new Date();
  console.log(`\n🔔 [${now.toLocaleString('pt-BR')}] Running notification generation job...`);

  try {
    const result = await notificationService.generateNotificationsForAllCards();

    console.log(`✅ Notification job completed:`);
    console.log(`   - Cards processed: ${result.cardsProcessed}`);
    console.log(`   - Notifications created: ${result.totalNotificationsCreated}`);

    if (result.totalNotificationsCreated > 0) {
      console.log(`   - Emails sent: ${result.totalNotificationsCreated}`);
    } else {
      console.log(`   - No notifications needed at this time`);
    }
  } catch (error) {
    console.error('❌ Error in notification cron job:', error);
  }
}, {
  scheduled: true,
  timezone: "America/Sao_Paulo" // Ajuste para seu fuso horário
});

// Função para executar manualmente (útil para testes)
const runNow = async () => {
  console.log('\n🚀 Running notification job manually...');
  try {
    const result = await notificationService.generateNotificationsForAllCards();
    console.log('✅ Manual job completed:', result);
    return result;
  } catch (error) {
    console.error('❌ Error in manual notification job:', error);
    throw error;
  }
};

module.exports = {
  notificationCronJob,
  runNow
};

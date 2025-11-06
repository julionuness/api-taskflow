require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes = require('./src/routes/authRoutes');
const workAreaRoutes = require('./src/routes/workAreaRoutes');
const kanbanRoutes = require('./src/routes/kanbanRoutes');
const notificationRoutes = require('./src/routes/notificationRoutes');
const activityLogRoutes = require('./src/routes/activityLogRoutes');
const errorHandler = require('./src/middleware/errorHandler');
const pool = require('./src/config/database');
const { notificationCronJob } = require('./src/jobs/notificationCron');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ message: 'TaskFlow Backend API' });
});

app.use('/auth', authRoutes);
app.use('/workareas', workAreaRoutes);
app.use('/kanban', kanbanRoutes);
app.use('/notifications', notificationRoutes);
app.use('/activity', activityLogRoutes);

app.use(errorHandler);

// Testar conexão com banco
pool.query('SELECT NOW()', (err, result) => {
  if (err) {
    console.error('❌ Erro ao conectar com PostgreSQL:', err.message);
  } else {
    console.log('✅ Conectado ao PostgreSQL:', result.rows[0].now);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`📅 Notification cron job is active (runs daily at 9:00 AM)`);
});
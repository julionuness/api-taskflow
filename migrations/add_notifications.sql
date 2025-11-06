-- Adicionar campo due_date na tabela kanban_card
ALTER TABLE kanban_card
ADD COLUMN IF NOT EXISTS due_date TIMESTAMP;

-- Criar tabela de notificações
CREATE TABLE IF NOT EXISTS notification (
  id SERIAL PRIMARY KEY,
  card_id INTEGER NOT NULL REFERENCES kanban_card(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('one_week', 'two_days', 'one_day', 'due_today')),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_notification_user_id ON notification(user_id);
CREATE INDEX IF NOT EXISTS idx_notification_card_id ON notification(card_id);
CREATE INDEX IF NOT EXISTS idx_notification_is_read ON notification(is_read);
CREATE INDEX IF NOT EXISTS idx_kanban_card_due_date ON kanban_card(due_date);

-- Comentários nas tabelas e colunas
COMMENT ON TABLE notification IS 'Tabela de notificações de prazo de entrega de cards';
COMMENT ON COLUMN notification.type IS 'Tipo de notificação: one_week (1 semana antes), two_days (2 dias antes), one_day (1 dia antes), due_today (no dia)';
COMMENT ON COLUMN kanban_card.due_date IS 'Data de entrega do card';

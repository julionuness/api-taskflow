-- Migration 002: Criar tabelas do sistema Kanban
-- Tabelas: kanban_column, kanban_card

-- Tabela de colunas do Kanban
CREATE TABLE IF NOT EXISTS kanban_column (
  id SERIAL PRIMARY KEY,
  work_area_id INTEGER NOT NULL REFERENCES work_area(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  position INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de cards do Kanban
CREATE TABLE IF NOT EXISTS kanban_card (
  id SERIAL PRIMARY KEY,
  column_id INTEGER NOT NULL REFERENCES kanban_column(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  position INTEGER NOT NULL,
  priority VARCHAR(20) DEFAULT 'baixa' CHECK (priority IN ('baixa', 'media', 'alta', 'urgente')),
  assigned_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  due_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_kanban_column_work_area_id ON kanban_column(work_area_id);
CREATE INDEX IF NOT EXISTS idx_kanban_column_position ON kanban_column(position);
CREATE INDEX IF NOT EXISTS idx_kanban_card_column_id ON kanban_card(column_id);
CREATE INDEX IF NOT EXISTS idx_kanban_card_position ON kanban_card(position);
CREATE INDEX IF NOT EXISTS idx_kanban_card_assigned_user_id ON kanban_card(assigned_user_id);
CREATE INDEX IF NOT EXISTS idx_kanban_card_due_date ON kanban_card(due_date);
CREATE INDEX IF NOT EXISTS idx_kanban_card_priority ON kanban_card(priority);

-- Comentários nas tabelas e colunas
COMMENT ON TABLE kanban_column IS 'Tabela de colunas do board Kanban';
COMMENT ON TABLE kanban_card IS 'Tabela de cards/tarefas do Kanban';
COMMENT ON COLUMN kanban_column.position IS 'Posição da coluna no board (ordem de exibição)';
COMMENT ON COLUMN kanban_card.position IS 'Posição do card dentro da coluna (ordem de exibição)';
COMMENT ON COLUMN kanban_card.priority IS 'Prioridade do card: baixa, media, alta, urgente';
COMMENT ON COLUMN kanban_card.assigned_user_id IS 'ID do usuário responsável pelo card';
COMMENT ON COLUMN kanban_card.due_date IS 'Data de entrega/vencimento do card';

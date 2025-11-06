-- Tabela de log de atividades
CREATE TABLE IF NOT EXISTS activity_log (
  id SERIAL PRIMARY KEY,
  work_area_id INTEGER NOT NULL REFERENCES work_area(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action_type VARCHAR(50) NOT NULL, -- 'create', 'update', 'delete', 'move', 'assign', etc
  entity_type VARCHAR(50) NOT NULL, -- 'card', 'column', 'user', 'workarea'
  entity_id INTEGER, -- ID da entidade afetada
  entity_name VARCHAR(255), -- Nome/título da entidade para exibição
  description TEXT NOT NULL, -- Descrição legível da ação
  metadata JSONB, -- Dados adicionais sobre a alteração
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_activity_log_work_area ON activity_log(work_area_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_user ON activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_created_at ON activity_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_log_entity ON activity_log(entity_type, entity_id);

-- Comentários
COMMENT ON TABLE activity_log IS 'Registra todas as atividades realizadas nas áreas de trabalho';
COMMENT ON COLUMN activity_log.action_type IS 'Tipo de ação: create, update, delete, move, assign, etc';
COMMENT ON COLUMN activity_log.entity_type IS 'Tipo de entidade: card, column, user, workarea';
COMMENT ON COLUMN activity_log.metadata IS 'Dados adicionais em JSON (ex: valores antigos/novos)';

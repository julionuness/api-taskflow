-- Migration 001: Criar tabelas iniciais do sistema
-- Tabelas: users, work_area, work_area_user

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de áreas de trabalho
CREATE TABLE IF NOT EXISTS work_area (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de relacionamento entre usuários e áreas de trabalho
CREATE TABLE IF NOT EXISTS work_area_user (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  work_area_id INTEGER NOT NULL REFERENCES work_area(id) ON DELETE CASCADE,
  is_manager BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, work_area_id)
);

-- Índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_work_area_user_user_id ON work_area_user(user_id);
CREATE INDEX IF NOT EXISTS idx_work_area_user_work_area_id ON work_area_user(work_area_id);

-- Comentários nas tabelas
COMMENT ON TABLE users IS 'Tabela de usuários do sistema';
COMMENT ON TABLE work_area IS 'Tabela de áreas de trabalho (workspaces)';
COMMENT ON TABLE work_area_user IS 'Relacionamento entre usuários e áreas de trabalho com permissões';
COMMENT ON COLUMN work_area_user.is_manager IS 'Define se o usuário é gerente da área de trabalho';

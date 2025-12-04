-- Script para executar todas as migrations na ordem correta
-- Execute este arquivo para criar toda a estrutura do banco de dados

-- Migration 001: Tabelas iniciais
\i 001_create_initial_tables.sql

-- Migration 002: Tabelas Kanban
\i 002_create_kanban_tables.sql

-- Migration 003: Notificações
\i 003_add_notifications.sql

-- Migration 004: Activity Log
\i 004_create_activity_log.sql

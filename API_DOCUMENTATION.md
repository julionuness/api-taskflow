# 📖 TaskFlow Backend - Documentação da API

## 🔗 Base URL
```
http://localhost:3000/api
```

## 🔐 Autenticação
A maioria dos endpoints requer autenticação via JWT Token no cabeçalho:
```
Authorization: Bearer <token>
```

---

## 📑 Índice

- [👤 Autenticação](#-autenticação)
- [🏢 Áreas de Trabalho](#-áreas-de-trabalho)
- [👥 Gerenciamento de Usuários](#-gerenciamento-de-usuários-nas-áreas)
- [📋 Kanban](#-kanban)
  - [Board e Estatísticas](#-obter-board-completo)
  - [Colunas](#-criar-coluna)
  - [Cards](#-criar-card)
- [🔔 Notificações](#-notificações)
- [📊 Activity Log](#-activity-log-registro-de-atividades)
- [📊 Modelos de Dados](#-modelos-de-dados)
- [⚠️ Códigos de Erro](#️-códigos-de-erro)
- [🔍 Exemplos de Uso](#-exemplos-de-uso)
- [🛠️ Configuração do Banco](#️-configuração-do-banco)

---

## 👤 **AUTENTICAÇÃO**

### 📝 Registrar Usuário
**POST** `/auth/register`

**Body:**
```json
{
  "name": "string (2-50 caracteres)",
  "email": "string (email válido)",
  "password": "string (mínimo 6 caracteres)"
}
```

**Resposta de Sucesso (201):**
```json
{
  "message": "Usuário registrado com sucesso",
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@email.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 🔑 Login
**POST** `/auth/login`

**Body:**
```json
{
  "email": "string (email válido)",
  "password": "string"
}
```

**Resposta de Sucesso (200):**
```json
{
  "message": "Login realizado com sucesso",
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@email.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 👤 Obter Perfil
**GET** `/auth/profile`

**Headers:** `Authorization: Bearer <token>`

**Resposta de Sucesso (200):**
```json
{
  "id": 1,
  "name": "João Silva",
  "email": "joao@email.com"
}
```

---

## 🏢 **ÁREAS DE TRABALHO**

### ➕ Criar Área de Trabalho
**POST** `/workareas`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "title": "string"
}
```

**Resposta de Sucesso (201):**
```json
{
  "message": "Área de trabalho criada com sucesso",
  "workArea": {
    "id": 1,
    "title": "Projeto X"
  },
  "workAreaUser": {
    "id": 1,
    "userId": 1,
    "workAreaId": 1,
    "isManager": true
  }
}
```

**Nota:** O criador é automaticamente adicionado como manager da área.

### ✏️ Atualizar Área de Trabalho
**PUT** `/workareas/:id`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "title": "string"
}
```

**Resposta de Sucesso (200):**
```json
{
  "message": "Área de trabalho atualizada com sucesso",
  "workArea": {
    "id": 1,
    "title": "Projeto X Atualizado"
  }
}
```

### 🗑️ Deletar Área de Trabalho
**DELETE** `/workareas/:id`

**Headers:** `Authorization: Bearer <token>`

**Resposta de Sucesso (200):**
```json
{
  "message": "Área de trabalho deletada com sucesso"
}
```

### 📋 Minhas Áreas de Trabalho
**GET** `/workareas/my-workareas`

**Headers:** `Authorization: Bearer <token>`

**Resposta de Sucesso (200):**
```json
{
  "workAreaUsers": [
    {
      "id": 1,
      "userId": 1,
      "workAreaId": 1,
      "isManager": true
    },
    {
      "id": 2,
      "userId": 1,
      "workAreaId": 2,
      "isManager": false
    }
  ]
}
```

### 👥 Usuários de uma Área de Trabalho
**GET** `/workareas/:id/users`

**Headers:** `Authorization: Bearer <token>`

**Resposta de Sucesso (200):**
```json
{
  "workAreaUsers": [
    {
      "id": 1,
      "userId": 1,
      "workAreaId": 1,
      "isManager": true
    },
    {
      "id": 2,
      "userId": 2,
      "workAreaId": 1,
      "isManager": false
    }
  ]
}
```

---

## 👥 **GERENCIAMENTO DE USUÁRIOS NAS ÁREAS**

### ➕ Adicionar Usuário à Área
**POST** `/workareas/add-user`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "workAreaId": "number",
  "userId": "number",
  "isManager": "boolean (opcional, padrão: false)"
}
```

**Resposta de Sucesso (201):**
```json
{
  "message": "Usuário adicionado à área de trabalho com sucesso",
  "workAreaUser": {
    "id": 3,
    "userId": 2,
    "workAreaId": 1,
    "isManager": false
  }
}
```

### ➖ Remover Usuário da Área
**DELETE** `/workareas/remove-user`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "userId": "number",
  "workAreaId": "number"
}
```

**Resposta de Sucesso (200):**
```json
{
  "message": "Usuário removido da área de trabalho com sucesso",
  "deleted": true
}
```

### 🔄 Atualizar Papel do Usuário
**PUT** `/workareas/user-role/:id`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "isManager": "boolean"
}
```

**Resposta de Sucesso (200):**
```json
{
  "message": "Papel do usuário atualizado com sucesso",
  "workAreaUser": {
    "id": 3,
    "userId": 2,
    "workAreaId": 1,
    "isManager": true
  }
}
```

---

## 📋 **KANBAN**

### 📊 Obter Board Completo
**GET** `/kanban/board/:workAreaId`

**Headers:** `Authorization: Bearer <token>`

**Resposta de Sucesso (200):**
```json
{
  "columns": [
    {
      "id": 1,
      "workAreaId": 1,
      "title": "A Fazer",
      "position": 0,
      "cards": [
        {
          "id": 1,
          "columnId": 1,
          "title": "Tarefa 1",
          "description": "Descrição da tarefa",
          "priority": "alta",
          "assignedTo": 2,
          "dueDate": "2024-12-31",
          "position": 0,
          "tags": ["bug", "urgente"]
        }
      ]
    }
  ]
}
```

### 📈 Obter Estatísticas do Board
**GET** `/kanban/stats/:workAreaId`

**Headers:** `Authorization: Bearer <token>`

**Resposta de Sucesso (200):**
```json
{
  "totalCards": 15,
  "cardsByColumn": {
    "A Fazer": 5,
    "Em Progresso": 7,
    "Concluído": 3
  },
  "cardsByPriority": {
    "baixa": 4,
    "media": 6,
    "alta": 3,
    "urgente": 2
  },
  "overdueTasks": 2,
  "completionRate": 20
}
```

### ➕ Criar Coluna
**POST** `/kanban/columns`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "workAreaId": "number",
  "title": "string",
  "position": "number (opcional)"
}
```

**Resposta de Sucesso (201):**
```json
{
  "message": "Coluna criada com sucesso",
  "column": {
    "id": 1,
    "workAreaId": 1,
    "title": "A Fazer",
    "position": 0
  }
}
```

### ✏️ Atualizar Coluna
**PUT** `/kanban/columns/:id`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "title": "string"
}
```

**Resposta de Sucesso (200):**
```json
{
  "message": "Coluna atualizada com sucesso",
  "column": {
    "id": 1,
    "title": "Fazendo"
  }
}
```

### 🗑️ Deletar Coluna
**DELETE** `/kanban/columns/:id`

**Headers:** `Authorization: Bearer <token>`

**Resposta de Sucesso (200):**
```json
{
  "message": "Coluna deletada com sucesso"
}
```

### 🔄 Atualizar Posições das Colunas
**PUT** `/kanban/columns/positions/update`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "columns": [
    { "id": 1, "position": 0 },
    { "id": 2, "position": 1 },
    { "id": 3, "position": 2 }
  ]
}
```

**Resposta de Sucesso (200):**
```json
{
  "message": "Posições das colunas atualizadas com sucesso"
}
```

### 🎴 Criar Card
**POST** `/kanban/cards`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "columnId": "number",
  "title": "string",
  "description": "string (opcional)",
  "priority": "string (baixa|media|alta|urgente, opcional)",
  "assignedTo": "number (opcional)",
  "dueDate": "date (opcional)",
  "tags": "array (opcional)",
  "position": "number (opcional)"
}
```

**Resposta de Sucesso (201):**
```json
{
  "message": "Card criado com sucesso",
  "card": {
    "id": 1,
    "columnId": 1,
    "title": "Nova tarefa",
    "description": "Descrição da tarefa",
    "priority": "alta",
    "assignedTo": 2,
    "dueDate": "2024-12-31",
    "position": 0,
    "tags": ["importante"]
  }
}
```

### ✏️ Atualizar Card
**PUT** `/kanban/cards/:id`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "title": "string (opcional)",
  "description": "string (opcional)",
  "priority": "string (opcional)",
  "assignedTo": "number (opcional)",
  "dueDate": "date (opcional)",
  "tags": "array (opcional)"
}
```

**Resposta de Sucesso (200):**
```json
{
  "message": "Card atualizado com sucesso",
  "card": {
    "id": 1,
    "title": "Tarefa atualizada",
    "description": "Nova descrição"
  }
}
```

### 🗑️ Deletar Card
**DELETE** `/kanban/cards/:id`

**Headers:** `Authorization: Bearer <token>`

**Resposta de Sucesso (200):**
```json
{
  "message": "Card deletado com sucesso"
}
```

### 🔄 Atualizar Posições dos Cards
**PUT** `/kanban/cards/positions/update`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "cards": [
    { "id": 1, "columnId": 1, "position": 0 },
    { "id": 2, "columnId": 1, "position": 1 },
    { "id": 3, "columnId": 2, "position": 0 }
  ]
}
```

**Resposta de Sucesso (200):**
```json
{
  "message": "Posições dos cards atualizadas com sucesso"
}
```

---

## 🔔 **NOTIFICAÇÕES**

### 📬 Obter Minhas Notificações
**GET** `/notifications`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `unreadOnly` (boolean, opcional) - Filtrar apenas não lidas
- `limit` (number, opcional) - Limitar quantidade
- `offset` (number, opcional) - Paginação

**Resposta de Sucesso (200):**
```json
{
  "notifications": [
    {
      "id": 1,
      "userId": 1,
      "type": "TASK_ASSIGNED",
      "title": "Nova tarefa atribuída",
      "message": "Você foi atribuído à tarefa: Implementar login",
      "isRead": false,
      "relatedEntityType": "card",
      "relatedEntityId": 5,
      "createdAt": "2024-10-22T10:30:00Z"
    }
  ],
  "totalUnread": 5
}
```

### ✅ Marcar Notificação como Lida
**PUT** `/notifications/:id/read`

**Headers:** `Authorization: Bearer <token>`

**Resposta de Sucesso (200):**
```json
{
  "message": "Notificação marcada como lida",
  "notification": {
    "id": 1,
    "isRead": true
  }
}
```

### ✅ Marcar Todas como Lidas
**PUT** `/notifications/read-all`

**Headers:** `Authorization: Bearer <token>`

**Resposta de Sucesso (200):**
```json
{
  "message": "Todas as notificações foram marcadas como lidas",
  "count": 5
}
```

### 🔔 Gerar Notificações Automáticas
**POST** `/notifications/generate`

**Headers:** `Authorization: Bearer <token>`

**Resposta de Sucesso (200):**
```json
{
  "message": "Notificações geradas com sucesso",
  "generated": {
    "overdue": 3,
    "dueSoon": 5
  }
}
```

### 📧 Testar Envio de Email
**POST** `/notifications/test-email`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "to": "email@example.com"
}
```

**Resposta de Sucesso (200):**
```json
{
  "message": "Email de teste enviado com sucesso"
}
```

### 🗑️ Limpar Todas as Notificações
**DELETE** `/notifications/clear-all`

**Headers:** `Authorization: Bearer <token>`

**Resposta de Sucesso (200):**
```json
{
  "message": "Todas as notificações foram removidas",
  "count": 10
}
```

---

## 📊 **ACTIVITY LOG (Registro de Atividades)**

### 📜 Obter Atividades da Área de Trabalho
**GET** `/activity-log/workarea/:workAreaId`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `limit` (number, opcional) - Limitar quantidade (padrão: 50)
- `offset` (number, opcional) - Paginação
- `activityType` (string, opcional) - Filtrar por tipo
- `userId` (number, opcional) - Filtrar por usuário
- `startDate` (date, opcional) - Data inicial
- `endDate` (date, opcional) - Data final

**Resposta de Sucesso (200):**
```json
{
  "activities": [
    {
      "id": 1,
      "workAreaId": 1,
      "userId": 2,
      "activityType": "CARD_CREATED",
      "entityType": "card",
      "entityId": 5,
      "description": "Criou o card: Implementar autenticação",
      "metadata": {
        "cardTitle": "Implementar autenticação",
        "columnId": 1
      },
      "createdAt": "2024-10-22T14:30:00Z"
    }
  ],
  "total": 150
}
```

### 🕐 Obter Atividades Recentes
**GET** `/activity-log/workarea/:workAreaId/recent`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `hours` (number, opcional) - Últimas N horas (padrão: 24)

**Resposta de Sucesso (200):**
```json
{
  "activities": [
    {
      "id": 15,
      "activityType": "CARD_MOVED",
      "description": "Moveu o card 'Task X' para 'Em Progresso'",
      "createdAt": "2024-10-22T15:45:00Z"
    }
  ],
  "period": "últimas 24 horas"
}
```

### 📈 Obter Estatísticas de Atividade
**GET** `/activity-log/workarea/:workAreaId/stats`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `period` (string, opcional) - Período (today|week|month, padrão: week)

**Resposta de Sucesso (200):**
```json
{
  "totalActivities": 245,
  "activitiesByType": {
    "CARD_CREATED": 45,
    "CARD_MOVED": 89,
    "CARD_UPDATED": 67,
    "CARD_DELETED": 12,
    "COLUMN_CREATED": 5,
    "USER_ADDED": 8,
    "USER_REMOVED": 3
  },
  "mostActiveUsers": [
    { "userId": 2, "name": "João Silva", "activityCount": 78 },
    { "userId": 3, "name": "Maria Santos", "activityCount": 56 }
  ],
  "dailyActivity": {
    "2024-10-20": 45,
    "2024-10-21": 67,
    "2024-10-22": 89
  }
}
```

### 🔍 Obter Atividades de uma Entidade
**GET** `/activity-log/entity/:entityType/:entityId`

**Headers:** `Authorization: Bearer <token>`

**Resposta de Sucesso (200):**
```json
{
  "activities": [
    {
      "id": 1,
      "activityType": "CARD_CREATED",
      "description": "Card criado",
      "userId": 2,
      "createdAt": "2024-10-20T10:00:00Z"
    },
    {
      "id": 5,
      "activityType": "CARD_UPDATED",
      "description": "Título atualizado de 'Task A' para 'Task A - Revisado'",
      "userId": 2,
      "createdAt": "2024-10-21T14:30:00Z"
    }
  ]
}
```

---

## 📊 **MODELOS DE DADOS**

### 🧑‍💼 User
```json
{
  "id": "number",
  "name": "string",
  "email": "string",
  "password": "string (não retornado nas respostas)"
}
```

### 🏢 WorkArea
```json
{
  "id": "number",
  "title": "string"
}
```

### 🔗 WorkAreaUser
```json
{
  "id": "number",
  "userId": "number (FK -> User.id)",
  "workAreaId": "number (FK -> WorkArea.id)",
  "isManager": "boolean"
}
```

### 📋 KanbanColumn
```json
{
  "id": "number",
  "workAreaId": "number (FK -> WorkArea.id)",
  "title": "string",
  "position": "number",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### 🎴 KanbanCard
```json
{
  "id": "number",
  "columnId": "number (FK -> KanbanColumn.id)",
  "title": "string",
  "description": "text",
  "priority": "string (baixa|media|alta|urgente)",
  "assignedTo": "number (FK -> User.id, nullable)",
  "dueDate": "date (nullable)",
  "position": "number",
  "tags": "jsonb (array de strings)",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### 🔔 Notification
```json
{
  "id": "number",
  "userId": "number (FK -> User.id)",
  "type": "string (TASK_ASSIGNED|TASK_DUE_SOON|TASK_OVERDUE|CARD_MOVED|etc)",
  "title": "string",
  "message": "text",
  "isRead": "boolean",
  "relatedEntityType": "string (card|column|workarea, nullable)",
  "relatedEntityId": "number (nullable)",
  "createdAt": "timestamp"
}
```

### 📊 ActivityLog
```json
{
  "id": "number",
  "workAreaId": "number (FK -> WorkArea.id)",
  "userId": "number (FK -> User.id)",
  "activityType": "string (CARD_CREATED|CARD_UPDATED|CARD_MOVED|CARD_DELETED|COLUMN_CREATED|etc)",
  "entityType": "string (card|column|workarea|user)",
  "entityId": "number",
  "description": "text",
  "metadata": "jsonb (dados adicionais)",
  "createdAt": "timestamp"
}
```

---

## ⚠️ **CÓDIGOS DE ERRO**

| Código | Descrição |
|--------|-----------|
| 400 | Bad Request - Dados inválidos |
| 401 | Unauthorized - Token não fornecido |
| 403 | Forbidden - Token inválido |
| 404 | Not Found - Recurso não encontrado |
| 500 | Internal Server Error - Erro interno |

---

## 🔍 **EXEMPLOS DE USO**

### Fluxo Completo - Do Registro ao Kanban:

#### 1️⃣ Autenticação
```javascript
// Registro
POST /api/auth/register
{ "name": "João Silva", "email": "joao@email.com", "password": "senha123" }
// Retorna: { token, user }

// Login
POST /api/auth/login
{ "email": "joao@email.com", "password": "senha123" }
// Retorna: { token, user }
```

#### 2️⃣ Criar Área de Trabalho
```javascript
POST /api/workareas
Headers: { Authorization: "Bearer <token>" }
{ "title": "Projeto Mobile App" }
// Você se torna manager automaticamente
```

#### 3️⃣ Adicionar Usuários
```javascript
POST /api/workareas/add-user
{ "workAreaId": 1, "userId": 2, "isManager": false }
// Adiciona usuário ao workspace
```

#### 4️⃣ Criar Board Kanban
```javascript
// Criar colunas
POST /api/kanban/columns
{ "workAreaId": 1, "title": "A Fazer", "position": 0 }

POST /api/kanban/columns
{ "workAreaId": 1, "title": "Em Progresso", "position": 1 }

POST /api/kanban/columns
{ "workAreaId": 1, "title": "Concluído", "position": 2 }
```

#### 5️⃣ Criar Cards
```javascript
POST /api/kanban/cards
{
  "columnId": 1,
  "title": "Implementar tela de login",
  "description": "Criar interface e lógica de autenticação",
  "priority": "alta",
  "assignedTo": 2,
  "dueDate": "2024-12-31",
  "tags": ["frontend", "auth"]
}
```

#### 6️⃣ Mover Cards (Drag & Drop)
```javascript
PUT /api/kanban/cards/positions/update
{
  "cards": [
    { "id": 1, "columnId": 2, "position": 0 }  // Move para "Em Progresso"
  ]
}
// Gera notificação e log de atividade automaticamente
```

#### 7️⃣ Monitorar Atividades
```javascript
// Ver histórico de mudanças
GET /api/activity-log/workarea/1/recent

// Ver estatísticas
GET /api/activity-log/workarea/1/stats?period=week
```

#### 8️⃣ Gerenciar Notificações
```javascript
// Obter notificações não lidas
GET /api/notifications?unreadOnly=true

// Marcar como lida
PUT /api/notifications/1/read
```

### Headers Necessários:
```bash
Content-Type: application/json
Authorization: Bearer <seu-token-jwt>
```

---

## 🛠️ **CONFIGURAÇÃO DO BANCO**

### Tabelas Necessárias:

#### Core Tables
- `users` (id, name, email, password, created_at)
- `work_area` (id, title, created_at, updated_at)
- `work_area_user` (id, user_id, work_area_id, is_manager, created_at)

#### Kanban Tables
- `kanban_column` (id, work_area_id, title, position, created_at, updated_at)
- `kanban_card` (id, column_id, title, description, priority, assigned_to, due_date, position, tags, created_at, updated_at)

#### System Tables
- `notification` (id, user_id, type, title, message, is_read, related_entity_type, related_entity_id, created_at)
- `activity_log` (id, work_area_id, user_id, activity_type, entity_type, entity_id, description, metadata, created_at)

### Relacionamentos:
```
users
  ├── work_area_user (user_id)
  ├── kanban_card (assigned_to)
  ├── notification (user_id)
  └── activity_log (user_id)

work_area
  ├── work_area_user (work_area_id)
  ├── kanban_column (work_area_id)
  └── activity_log (work_area_id)

kanban_column
  └── kanban_card (column_id)
```

### Comandos de Migration:
```bash
# Execute as migrações na ordem:
npm run migrate
```

### Cron Jobs Configurados:
- **Notificações Automáticas** - Roda a cada 1 hora
  - Verifica tarefas próximas do vencimento (24h)
  - Verifica tarefas atrasadas
  - Envia emails e cria notificações

---

## 📈 **RESUMO DA API**

### Estatísticas
- **Total de Endpoints:** 35+
- **Módulos:** 5 (Auth, WorkAreas, Kanban, Notifications, ActivityLog)
- **Métodos HTTP:** GET, POST, PUT, DELETE
- **Autenticação:** JWT Bearer Token
- **Formato:** JSON

### Recursos por Módulo

| Módulo | Endpoints | Principais Funcionalidades |
|--------|-----------|---------------------------|
| **Autenticação** | 3 | Registro, Login, Perfil |
| **WorkAreas** | 9 | CRUD, Gerenciamento de usuários e roles |
| **Kanban** | 10 | Boards, Colunas, Cards, Estatísticas, Drag & Drop |
| **Notificações** | 6 | Listagem, Leitura, Emails, Geração automática |
| **Activity Log** | 4 | Histórico, Atividades recentes, Estatísticas |

### Tipos de Dados Suportados

- **Prioridades:** `baixa`, `media`, `alta`, `urgente`
- **Roles:** `admin`, `member`, `viewer` (via isManager)
- **Tipos de Notificação:** `TASK_ASSIGNED`, `TASK_DUE_SOON`, `TASK_OVERDUE`, `CARD_MOVED`, etc.
- **Tipos de Atividade:** `CARD_CREATED`, `CARD_UPDATED`, `CARD_MOVED`, `CARD_DELETED`, `COLUMN_CREATED`, `USER_ADDED`, etc.
- **Entidades:** `card`, `column`, `workarea`, `user`

---

## 💡 **BOAS PRÁTICAS**

### Segurança
- ✅ Sempre incluir o token JWT no header `Authorization`
- ✅ Nunca expor credenciais ou tokens no código
- ✅ Usar HTTPS em produção
- ✅ Validar dados no frontend antes de enviar

### Performance
- ✅ Usar paginação em listas grandes (limit/offset)
- ✅ Filtrar dados no backend, não no frontend
- ✅ Cachear dados que não mudam frequentemente
- ✅ Usar query parameters para filtros

### Organização
- ✅ Manter estrutura consistente de payloads
- ✅ Tratar erros adequadamente
- ✅ Usar códigos HTTP corretos
- ✅ Documentar todas as mudanças na API

---

## 🔗 **LINKS ÚTEIS**

- 📖 [README Principal](README.md)
- 🗂️ [Repositório GitHub](https://github.com/julionuness/api-taskflow)
- 📧 [Reportar Issues](https://github.com/julionuness/api-taskflow/issues)

---

<div align="center">

**TaskFlow Backend API v1.0.0**

Desenvolvido com ❤️ para gestão eficiente de projetos

[⬆ Voltar ao topo](#-taskflow-backend---documentação-da-api)

</div>
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

### Fluxo Completo de Criação de Área:
1. **Registrar/Login** → Obter token
2. **Criar área** → Você se torna manager automaticamente
3. **Adicionar usuários** → Convidar outros para a área
4. **Gerenciar papéis** → Promover usuários a managers

### Headers Necessários:
```bash
Content-Type: application/json
Authorization: Bearer <seu-token-jwt>
```

---

## 🛠️ **CONFIGURAÇÃO DO BANCO**

### Tabelas necessárias:
- `users` (id, name, email, password)
- `work_area` (id, title)
- `work_area_user` (id, user_id, work_area_id, is_manager)

### Relacionamentos:
- `work_area_user.user_id` → `users.id`
- `work_area_user.work_area_id` → `work_area.id`
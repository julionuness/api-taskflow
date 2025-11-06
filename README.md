# 📋 TaskFlow Backend

<div align="center">

**Uma ferramenta moderna para gestão de tarefas e projetos em equipe**

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)]()
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)]()
[![API](https://img.shields.io/badge/API-REST-blue?style=for-the-badge)]()
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)]()
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)]()

</div>

---

## 📑 Índice

- [🚀 Sobre o Projeto](#-sobre-o-projeto)
- [🎯 Objetivos](#-objetivos)
- [⚡ Funcionalidades Principais](#-funcionalidades-principais)
  - [🏢 Áreas de Trabalho](#-áreas-de-trabalho-work-areas)
  - [🎨 Sistema Kanban](#-sistema-kanban-completo)
  - [🔔 Notificações](#-sistema-de-notificações)
  - [📊 Activity Log](#-activity-log-registro-de-atividades)
  - [🔒 Segurança](#-segurança-e-autenticação)
- [🛠️ Tecnologias](#️-tecnologias)
- [🏗️ Arquitetura](#️-arquitetura-do-projeto)
- [📦 Instalação](#-instalação)
- [🔧 Configuração](#-configuração)
- [🌐 Estrutura de Endpoints](#-estrutura-de-endpoints)
- [✨ Features Implementadas](#-features-implementadas)
- [🚧 Roadmap](#-roadmap)
- [🤝 Contribuindo](#-contribuindo)
- [📄 Licença](#-licença)

---

## 🚀 Sobre o Projeto

TaskFlow é uma ferramenta inovadora desenvolvida para **revolucionar** a organização de tarefas e definição de prioridades em equipes de desenvolvimento e produto.

Através de uma interface intuitiva baseada no modelo **Kanban** e recursos funcionais avançados, o sistema foi projetado para:

- ✨ **Simplificar** a comunicação entre membros da equipe
- 🔍 **Promover** total transparência nos processos
- 📈 **Otimizar** a gestão e execução de projetos

---

## 🎯 Objetivos

| Funcionalidade | Descrição |
|---|---|
| 📝 **Organização de Tarefas** | Estruturar e categorizar atividades de forma clara e acessível |
| ⭐ **Definição de Prioridades** | Estabelecer níveis de importância e urgência para cada tarefa |
| 🤝 **Gestão Colaborativa** | Facilitar o trabalho em equipe com recursos de comunicação |
| 🔄 **Otimização de Processos** | Melhorar fluxo de trabalho e produtividade das equipes |

---

## ⚡ Funcionalidades Principais

### 🏢 Áreas de Trabalho (Work Areas)
- **Criação e Gerenciamento** - Criação de múltiplos espaços de trabalho organizados
- **Controle de Acesso** - Gerenciamento de usuários por área de trabalho
- **Sistema de Funções** - Definição de roles (admin, member, viewer) para controle de permissões
- **Workspace Isolado** - Cada área mantém seus próprios boards e dados

### 🎨 Sistema Kanban Completo
- **Boards Dinâmicos** - Visualização Kanban por área de trabalho
- **Colunas Customizáveis** - Criação, edição e reordenação de colunas
- **Cards Inteligentes** - Criação e gestão de tarefas com múltiplos campos:
  - Título e descrição
  - Prioridade (baixa, média, alta, urgente)
  - Status customizado por coluna
  - Atribuição de responsáveis
  - Datas de vencimento
  - Tags e categorização
- **Drag & Drop** - Reordenação de cards e colunas com atualização de posições
- **Estatísticas em Tempo Real** - Dashboard com métricas de produtividade

### 🔔 Sistema de Notificações
- **Notificações em Tempo Real** - Alertas sobre atividades relevantes
- **Envio de Emails** - Integração com SMTP para notificações por email
- **Notificações Automáticas** - Sistema de cron jobs para alertas periódicos:
  - Tarefas próximas do vencimento
  - Tarefas atrasadas
  - Mudanças em cards atribuídos
- **Gestão de Leitura** - Marcar notificações individuais ou todas como lidas
- **Filtros e Priorização** - Notificações organizadas por tipo e prioridade

### 📊 Activity Log (Registro de Atividades)
- **Auditoria Completa** - Registro de todas as ações na plataforma
- **Histórico de Alterações** - Tracking de mudanças em:
  - Cards (criação, edição, movimentação)
  - Colunas (criação, edição, remoção)
  - Áreas de trabalho (alterações de configuração)
  - Usuários (adição, remoção, mudança de roles)
- **Estatísticas de Atividade** - Métricas sobre produtividade e engajamento
- **Filtros Avançados** - Busca por período, tipo de atividade, usuário e entidade
- **Timeline Visual** - Visualização cronológica de todas as ações

### 🔒 Segurança e Autenticação
- **JWT Authentication** - Sistema robusto de autenticação via tokens
- **Hashing de Senhas** - Bcrypt para proteção de credenciais
- **Middleware de Autorização** - Validação de permissões em todas as rotas
- **Helmet Security** - Headers de segurança HTTP configurados
- **CORS Configurável** - Controle de acesso cross-origin

### 📱 API RESTful
- **Endpoints Completos** - API totalmente documentada
- **Validação de Dados** - Joi schemas para validação robusta
- **Error Handling** - Tratamento centralizado de erros
- **Logging** - Morgan para registro de requisições

---

## 🛠️ Tecnologias

Este repositório contém o **backend** da aplicação TaskFlow, construído com tecnologias modernas:

```javascript
{
  "runtime": "Node.js",
  "language": "JavaScript",
  "framework": "Express.js 5.x",
  "database": "PostgreSQL",
  "authentication": "JWT (jsonwebtoken)",
  "validation": "Joi",
  "security": "Helmet + Bcrypt",
  "email": "Nodemailer",
  "scheduling": "Node-Cron",
  "logging": "Morgan"
}
```

### Stack Completo
- **Express 5.1.0** - Framework web rápido e minimalista
- **PostgreSQL** - Banco de dados relacional robusto
- **JWT** - Autenticação stateless com tokens
- **Bcrypt** - Hash seguro de senhas
- **Joi** - Validação de schemas e dados
- **Helmet** - Proteção de headers HTTP
- **Nodemailer** - Envio de emails
- **Node-Cron** - Agendamento de tarefas automáticas
- **Morgan** - Logger de requisições HTTP

---

## 🏗️ Arquitetura do Projeto

O projeto segue uma arquitetura em camadas (Layered Architecture):

```
taskflow_backend/
├── src/
│   ├── config/          # Configurações (DB, env)
│   ├── controllers/     # Controladores (requisições/respostas)
│   ├── services/        # Lógica de negócio
│   ├── repositories/    # Acesso a dados (queries)
│   ├── models/          # Modelos de dados
│   ├── routes/          # Definição de rotas
│   ├── middleware/      # Middlewares (auth, errors)
│   ├── validators/      # Validação de dados (Joi)
│   ├── utils/           # Utilitários e helpers
│   └── jobs/            # Cron jobs e tarefas agendadas
├── migrations/          # Scripts de migração do banco
├── server.js            # Ponto de entrada da aplicação
└── package.json         # Dependências do projeto
```

### Fluxo de Requisição
```
Request → Routes → Middleware (Auth) → Controller → Service → Repository → Database
                                                               ↓
Response ← Controller ← Service ← Repository ← Database
```

### Camadas
- **Routes**: Definem os endpoints da API
- **Controllers**: Recebem requisições e retornam respostas
- **Services**: Contêm a lógica de negócio
- **Repositories**: Executam queries no banco de dados
- **Models**: Definem estrutura dos dados
- **Middleware**: Autenticação, validação e tratamento de erros

---

## 📦 Instalação

### Pré-requisitos
- Node.js (v16 ou superior)
- npm ou yarn
- Banco de dados (MongoDB/PostgreSQL)

### Passos de instalação

```bash
# 1. Clone o repositório
git clone https://github.com/julionuness/api-taskflow
cd taskflow_backend

# 2. Instale as dependências
npm install
# ou
yarn install

# 3. Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# 4. Execute as migrações (se necessário)
npm run migrate

# 5. Inicie o servidor
npm run dev
```

### 🚀 Scripts Disponíveis

```bash
npm start          # Produção
npm run dev        # Desenvolvimento
npm run test       # Testes
npm run build      # Build para produção
npm run lint       # Verificar código
```

---

## 🔧 Configuração

### Variáveis de Ambiente

```env
# Servidor
PORT=3000
NODE_ENV=development

# Banco de Dados
DATABASE_URL=your_database_url
DB_HOST=localhost
DB_PORT=5432
DB_NAME=taskflow

# Autenticação
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# Email (opcional)
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_password
```

---

## 🌐 Estrutura de Endpoints

A API está organizada nos seguintes módulos:

### Autenticação (`/api/auth`)
```
POST   /register          - Registrar novo usuário
POST   /login             - Login e obtenção de token
GET    /profile           - Obter perfil do usuário autenticado
```

### Áreas de Trabalho (`/api/workareas`)
```
POST   /                  - Criar área de trabalho
GET    /my-workareas      - Listar minhas áreas
GET    /:id               - Obter detalhes de uma área
PUT    /:id               - Atualizar área
DELETE /:id               - Deletar área
GET    /:id/users         - Listar usuários da área
POST   /add-user          - Adicionar usuário à área
DELETE /remove-user       - Remover usuário da área
PUT    /user-role/:id     - Atualizar papel do usuário
```

### Kanban (`/api/kanban`)
```
# Board
GET    /board/:workAreaId - Obter board completo
GET    /stats/:workAreaId - Obter estatísticas

# Colunas
POST   /columns           - Criar coluna
PUT    /columns/:id       - Atualizar coluna
DELETE /columns/:id       - Deletar coluna
PUT    /columns/positions/update - Reordenar colunas

# Cards
POST   /cards             - Criar card
PUT    /cards/:id         - Atualizar card
DELETE /cards/:id         - Deletar card
PUT    /cards/positions/update - Mover/reordenar cards
```

### Notificações (`/api/notifications`)
```
GET    /                  - Listar notificações
PUT    /:id/read          - Marcar como lida
PUT    /read-all          - Marcar todas como lidas
POST   /generate          - Gerar notificações automáticas
POST   /test-email        - Testar envio de email
DELETE /clear-all         - Limpar todas (dev only)
```

### Activity Log (`/api/activity-log`)
```
GET    /workarea/:workAreaId          - Histórico completo
GET    /workarea/:workAreaId/recent   - Atividades recentes
GET    /workarea/:workAreaId/stats    - Estatísticas
GET    /entity/:entityType/:entityId  - Histórico de entidade
```

> 📖 **Documentação Completa:** Consulte o arquivo [API_DOCUMENTATION.md](API_DOCUMENTATION.md) para detalhes completos de todos os endpoints, incluindo payloads, respostas e exemplos.

---

## ✨ Features Implementadas

- ✅ Sistema de autenticação JWT completo
- ✅ Gerenciamento de áreas de trabalho (workspaces)
- ✅ Sistema de permissões por área (admin/member/viewer)
- ✅ Board Kanban com colunas e cards
- ✅ Drag & Drop para reordenação de cards e colunas
- ✅ Sistema de prioridades (baixa, média, alta, urgente)
- ✅ Atribuição de tarefas a usuários
- ✅ Datas de vencimento e tags
- ✅ Sistema de notificações em tempo real
- ✅ Envio de emails automáticos (SMTP)
- ✅ Cron jobs para alertas automáticos
- ✅ Activity log completo (auditoria)
- ✅ Estatísticas e métricas de produtividade
- ✅ Validação de dados com Joi
- ✅ Segurança com Helmet e CORS
- ✅ Error handling centralizado
- ✅ Arquitetura em camadas bem definida

## 🚧 Roadmap

Funcionalidades planejadas para futuras versões:

- 🔜 WebSocket para atualizações em tempo real
- 🔜 Sistema de comentários em cards
- 🔜 Upload de anexos/arquivos
- 🔜 Filtros avançados e busca
- 🔜 Dashboard com gráficos e analytics
- 🔜 Templates de boards
- 🔜 Integração com calendário
- 🔜 Exportação de dados (CSV, PDF)
- 🔜 API de webhooks
- 🔜 Testes automatizados (Jest)
- 🔜 Docker e CI/CD

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👥 Equipe

Desenvolvido com pela equipe TaskFlow

---

<div align="center">

**[⬆ Voltar ao topo](#-taskflow-backend)**

Made with 💻 and ☕

</div>
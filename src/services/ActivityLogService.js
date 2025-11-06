const ActivityLogRepository = require('../repositories/ActivityLogRepository');

class ActivityLogService {
  constructor() {
    this.repository = new ActivityLogRepository();
  }

  // Método auxiliar para criar descrições legíveis
  createDescription(actionType, entityType, entityName, metadata = {}) {
    const actions = {
      create: 'criou',
      update: 'atualizou',
      delete: 'deletou',
      move: 'moveu',
      assign: 'atribuiu',
      unassign: 'removeu atribuição de',
      add_user: 'adicionou usuário em',
      remove_user: 'removeu usuário de',
      change_priority: 'alterou prioridade de',
      change_status: 'alterou status de'
    };

    const entities = {
      card: 'o card',
      column: 'a coluna',
      workarea: 'a área de trabalho',
      user: 'o usuário'
    };

    const action = actions[actionType] || actionType;
    const entity = entities[entityType] || entityType;

    let description = `${action} ${entity} "${entityName}"`;

    // Adicionar informações extras baseadas no metadata
    if (actionType === 'move' && metadata.fromColumn && metadata.toColumn) {
      description += ` de "${metadata.fromColumn}" para "${metadata.toColumn}"`;
    } else if (actionType === 'change_priority' && metadata.oldValue && metadata.newValue) {
      description += ` de "${metadata.oldValue}" para "${metadata.newValue}"`;
    } else if (actionType === 'assign' && metadata.assignedTo) {
      description += ` para ${metadata.assignedTo}`;
    } else if (actionType === 'update' && metadata.changes) {
      // Para updates com mudanças detalhadas, deixar mais simples
      // Os detalhes serão mostrados nos badges do frontend
      const changeTypes = [];
      if (metadata.changes.title) changeTypes.push('título');
      if (metadata.changes.priority) changeTypes.push('prioridade');
      if (metadata.changes.description) changeTypes.push('descrição');
      if (metadata.changes.dueDate) changeTypes.push('data');

      if (changeTypes.length > 0) {
        // Não adicionar nada na descrição, os badges vão mostrar
        // Mas podemos adicionar um resumo simples
        if (changeTypes.length === 1) {
          description = `atualizou ${changeTypes[0]} do card "${entityName}"`;
        } else {
          description = `atualizou o card "${entityName}"`;
        }
      }
    }

    return description;
  }

  async logActivity({ workAreaId, userId, actionType, entityType, entityId, entityName, metadata = {} }) {
    try {
      const description = this.createDescription(actionType, entityType, entityName, metadata);

      const log = await this.repository.create({
        workAreaId,
        userId,
        actionType,
        entityType,
        entityId,
        entityName,
        description,
        metadata
      });

      return log;
    } catch (error) {
      console.error('Erro ao criar log de atividade:', error);
      // Não propagar erro para não quebrar a operação principal
      return null;
    }
  }

  async getWorkAreaActivity(workAreaId, limit = 50, offset = 0) {
    try {
      const activities = await this.repository.findByWorkArea(workAreaId, limit, offset);
      const total = await this.repository.countByWorkArea(workAreaId);

      return {
        activities: activities.map(this.formatActivity),
        total,
        limit,
        offset
      };
    } catch (error) {
      console.error('Erro ao buscar atividades:', error);
      throw error;
    }
  }

  async getEntityActivity(entityType, entityId, limit = 20) {
    try {
      const activities = await this.repository.findByEntity(entityType, entityId, limit);
      return activities.map(this.formatActivity);
    } catch (error) {
      console.error('Erro ao buscar atividades da entidade:', error);
      throw error;
    }
  }

  async getRecentActivity(workAreaId, hours = 24) {
    try {
      const activities = await this.repository.getRecentActivity(workAreaId, hours);
      return activities.map(this.formatActivity);
    } catch (error) {
      console.error('Erro ao buscar atividades recentes:', error);
      throw error;
    }
  }

  async getActivityStats(workAreaId, days = 7) {
    try {
      const stats = await this.repository.getActivityStats(workAreaId, days);
      return this.formatStats(stats);
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      throw error;
    }
  }

  formatActivity(activity) {
    return {
      id: activity.id,
      workAreaId: activity.work_area_id,
      userId: activity.user_id,
      userName: activity.user_name,
      userEmail: activity.user_email,
      actionType: activity.action_type,
      entityType: activity.entity_type,
      entityId: activity.entity_id,
      entityName: activity.entity_name,
      description: activity.description,
      metadata: activity.metadata,
      createdAt: activity.created_at
    };
  }

  formatStats(stats) {
    // Agrupar por data
    const byDate = {};
    const byAction = {};
    const byEntity = {};

    stats.forEach(stat => {
      const date = stat.date;
      const count = parseInt(stat.count);

      // Por data
      if (!byDate[date]) {
        byDate[date] = 0;
      }
      byDate[date] += count;

      // Por ação
      if (!byAction[stat.action_type]) {
        byAction[stat.action_type] = 0;
      }
      byAction[stat.action_type] += count;

      // Por entidade
      if (!byEntity[stat.entity_type]) {
        byEntity[stat.entity_type] = 0;
      }
      byEntity[stat.entity_type] += count;
    });

    return {
      byDate,
      byAction,
      byEntity,
      raw: stats
    };
  }

  // Métodos de conveniência para log de ações específicas
  async logCardCreated(workAreaId, userId, card) {
    return this.logActivity({
      workAreaId,
      userId,
      actionType: 'create',
      entityType: 'card',
      entityId: card.id,
      entityName: card.title,
      metadata: { priority: card.priority, columnId: card.columnId }
    });
  }

  async logCardUpdated(workAreaId, userId, card, changes = {}) {
    return this.logActivity({
      workAreaId,
      userId,
      actionType: 'update',
      entityType: 'card',
      entityId: card.id,
      entityName: card.title,
      metadata: { changes }
    });
  }

  async logCardDeleted(workAreaId, userId, card) {
    return this.logActivity({
      workAreaId,
      userId,
      actionType: 'delete',
      entityType: 'card',
      entityId: card.id,
      entityName: card.title
    });
  }

  async logCardMoved(workAreaId, userId, card, fromColumn, toColumn) {
    return this.logActivity({
      workAreaId,
      userId,
      actionType: 'move',
      entityType: 'card',
      entityId: card.id,
      entityName: card.title,
      metadata: { fromColumn, toColumn }
    });
  }

  async logColumnCreated(workAreaId, userId, column) {
    return this.logActivity({
      workAreaId,
      userId,
      actionType: 'create',
      entityType: 'column',
      entityId: column.id,
      entityName: column.title
    });
  }

  async logColumnUpdated(workAreaId, userId, column) {
    return this.logActivity({
      workAreaId,
      userId,
      actionType: 'update',
      entityType: 'column',
      entityId: column.id,
      entityName: column.title
    });
  }

  async logColumnDeleted(workAreaId, userId, column) {
    return this.logActivity({
      workAreaId,
      userId,
      actionType: 'delete',
      entityType: 'column',
      entityId: column.id,
      entityName: column.title
    });
  }

  async logUserAdded(workAreaId, userId, addedUser, workAreaName) {
    return this.logActivity({
      workAreaId,
      userId,
      actionType: 'add_user',
      entityType: 'workarea',
      entityName: workAreaName,
      metadata: { addedUserId: addedUser.id, addedUserName: addedUser.name }
    });
  }

  async logUserRemoved(workAreaId, userId, removedUser, workAreaName) {
    return this.logActivity({
      workAreaId,
      userId,
      actionType: 'remove_user',
      entityType: 'workarea',
      entityName: workAreaName,
      metadata: { removedUserId: removedUser.id, removedUserName: removedUser.name }
    });
  }
}

module.exports = ActivityLogService;

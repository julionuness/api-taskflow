const kanbanService = require('../services/kanbanService');
const ActivityLogService = require('../services/ActivityLogService');
const { HTTP_STATUS } = require('../utils/constants');

const activityLogService = new ActivityLogService();

// ============== COLUMNS ==============

const createColumn = async (req, res) => {
  try {
    const { workAreaId, title } = req.body;
    const userId = req.user.id;

    // Buscar a última posição
    const columns = await kanbanService.getColumnsByWorkArea(workAreaId);
    const position = columns.length;

    const result = await kanbanService.createColumn({ workAreaId, title, position });

    // Log da atividade
    await activityLogService.logColumnCreated(workAreaId, userId, result.column);

    res.status(HTTP_STATUS.CREATED).json({
      message: 'Coluna criada com sucesso',
      ...result
    });
  } catch (error) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: error.message
    });
  }
};

const updateColumn = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const result = await kanbanService.updateColumn(id, req.body);

    // Log da atividade
    await activityLogService.logColumnUpdated(result.column.workAreaId, userId, result.column);

    res.status(HTTP_STATUS.OK).json({
      message: 'Coluna atualizada com sucesso',
      ...result
    });
  } catch (error) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: error.message
    });
  }
};

const deleteColumn = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Buscar coluna antes de deletar para ter os dados
    const pool = require('../config/database');
    const columnResult = await pool.query('SELECT * FROM kanban_column WHERE id = $1', [id]);
    const column = columnResult.rows[0];

    const result = await kanbanService.deleteColumn(id);

    // Log da atividade
    if (column) {
      await activityLogService.logColumnDeleted(column.work_area_id, userId, column);
    }

    res.status(HTTP_STATUS.OK).json({
      message: 'Coluna deletada com sucesso',
      ...result
    });
  } catch (error) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: error.message
    });
  }
};

const updateColumnPositions = async (req, res) => {
  try {
    const { updates } = req.body; // Array de { id, position }
    const result = await kanbanService.updateColumnPositions(updates);

    res.status(HTTP_STATUS.OK).json({
      message: 'Posições das colunas atualizadas',
      ...result
    });
  } catch (error) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: error.message
    });
  }
};

// ============== CARDS ==============

const createCard = async (req, res) => {
  try {
    const { columnId, title, description, priority, assignedUserId, dueDate } = req.body;
    const userId = req.user.id;
    console.log('Creating card with data:', { columnId, title, description, priority, assignedUserId, dueDate });

    const pool = require('../config/database');

    // Incrementar a posição de todos os cards existentes na coluna
    await pool.query(
      'UPDATE kanban_card SET position = position + 1 WHERE column_id = $1',
      [columnId]
    );

    // Criar o novo card na posição 0 (primeira posição)
    const cardData = {
      columnId,
      title,
      description,
      position: 0,
      priority: priority || 'baixa',
      assignedUserId: assignedUserId || null,
      dueDate: dueDate || null
    };

    console.log('Card data to create:', cardData);

    const result = await kanbanService.createCard(cardData);
    console.log('Card created result:', result);

    // Buscar workAreaId da coluna
    const columnResult = await pool.query('SELECT work_area_id FROM kanban_column WHERE id = $1', [columnId]);
    const workAreaId = columnResult.rows[0]?.work_area_id;

    // Log da atividade
    if (workAreaId) {
      await activityLogService.logCardCreated(workAreaId, userId, result.card);
    }

    // NOTA: Notificações e emails são gerados pelo cron job diário
    // Não geramos na criação para evitar delay no response

    res.status(HTTP_STATUS.CREATED).json({
      message: 'Card criado com sucesso',
      ...result
    });
  } catch (error) {
    console.error('Error creating card:', error);
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: error.message
    });
  }
};

const updateCard = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const pool = require('../config/database');

    // Buscar dados do card ANTES da atualização
    const oldCardQuery = `
      SELECT kcard.*, kc.work_area_id
      FROM kanban_card kcard
      INNER JOIN kanban_column kc ON kcard.column_id = kc.id
      WHERE kcard.id = $1
    `;
    const oldCardResult = await pool.query(oldCardQuery, [id]);
    const oldCard = oldCardResult.rows[0];

    // Atualizar o card
    const result = await kanbanService.updateCard(id, req.body);

    // Log da atividade com informações de mudanças
    if (oldCard) {
      const changes = {};

      // Detectar mudanças APENAS nos campos que foram enviados
      if ('title' in req.body && req.body.title !== oldCard.title) {
        changes.title = { old: oldCard.title, new: req.body.title };
      }
      if ('description' in req.body && req.body.description !== oldCard.description) {
        changes.description = { old: oldCard.description, new: req.body.description };
      }
      if ('priority' in req.body && req.body.priority !== oldCard.priority) {
        changes.priority = { old: oldCard.priority, new: req.body.priority };
      }
      if ('dueDate' in req.body) {
        // Normalizar datas para comparação (podem vir em formatos diferentes)
        const oldDate = oldCard.due_date ? new Date(oldCard.due_date).toISOString().split('T')[0] : null;
        const newDate = req.body.dueDate ? new Date(req.body.dueDate).toISOString().split('T')[0] : null;

        if (oldDate !== newDate) {
          changes.dueDate = { old: oldCard.due_date, new: req.body.dueDate };
        }
      }

      // Só logar se houver mudanças reais
      if (Object.keys(changes).length > 0) {
        await activityLogService.logCardUpdated(oldCard.work_area_id, userId, result.card, changes);
      }
    }

    res.status(HTTP_STATUS.OK).json({
      message: 'Card atualizado com sucesso',
      ...result
    });
  } catch (error) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: error.message
    });
  }
};

const deleteCard = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Buscar card e workAreaId antes de deletar
    const pool = require('../config/database');
    const cardQuery = `
      SELECT kcard.*, kc.work_area_id
      FROM kanban_card kcard
      INNER JOIN kanban_column kc ON kcard.column_id = kc.id
      WHERE kcard.id = $1
    `;
    const cardResult = await pool.query(cardQuery, [id]);
    const card = cardResult.rows[0];

    const result = await kanbanService.deleteCard(id);

    // Log da atividade
    if (card) {
      await activityLogService.logCardDeleted(card.work_area_id, userId, card);
    }

    res.status(HTTP_STATUS.OK).json({
      message: 'Card deletado com sucesso',
      ...result
    });
  } catch (error) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: error.message
    });
  }
};

const updateCardPositions = async (req, res) => {
  try {
    const { updates } = req.body; // Array de { id, columnId, position }
    const userId = req.user.id;
    const pool = require('../config/database');

    // Buscar informações dos cards antes da atualização para detectar mudanças de coluna
    for (const update of updates) {
      if (update.columnId) {
        // Buscar card atual
        const cardQuery = `
          SELECT
            kcard.id,
            kcard.title,
            kcard.column_id as old_column_id,
            old_col.title as old_column_title,
            old_col.work_area_id,
            new_col.title as new_column_title
          FROM kanban_card kcard
          INNER JOIN kanban_column old_col ON kcard.column_id = old_col.id
          INNER JOIN kanban_column new_col ON new_col.id = $2
          WHERE kcard.id = $1
        `;
        const cardResult = await pool.query(cardQuery, [update.id, update.columnId]);

        if (cardResult.rows.length > 0) {
          const cardData = cardResult.rows[0];

          // Se mudou de coluna, registrar log
          if (cardData.old_column_id !== update.columnId) {
            await activityLogService.logCardMoved(
              cardData.work_area_id,
              userId,
              { id: cardData.id, title: cardData.title },
              cardData.old_column_title,
              cardData.new_column_title
            );
          }
        }
      }
    }

    const result = await kanbanService.updateCardPositions(updates);

    res.status(HTTP_STATUS.OK).json({
      message: 'Posições dos cards atualizadas',
      ...result
    });
  } catch (error) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: error.message
    });
  }
};

// ============== BOARD ==============

const getBoard = async (req, res) => {
  try {
    const { workAreaId } = req.params;
    console.log('Getting board for workAreaId:', workAreaId);
    const pool = require('../config/database');

    // Buscar informações da área de trabalho
    const workAreaQuery = 'SELECT id, title FROM work_area WHERE id = $1';
    const workAreaResult = await pool.query(workAreaQuery, [workAreaId]);
    const workAreaData = workAreaResult.rows[0];

    // Buscar colunas
    const columnsQuery = 'SELECT * FROM kanban_column WHERE work_area_id = $1 ORDER BY position';
    const columnsResult = await pool.query(columnsQuery, [workAreaId]);

    // Buscar cards com nome do usuário atribuído
    const cardsQuery = `
      SELECT kc.*, u.name as assigned_user_name
      FROM kanban_card kc
      LEFT JOIN users u ON kc.assigned_user_id = u.id
      INNER JOIN kanban_column kcol ON kc.column_id = kcol.id
      WHERE kcol.work_area_id = $1
      ORDER BY kc.column_id, kc.position
    `;
    const cardsResult = await pool.query(cardsQuery, [workAreaId]);

    // Agrupar cards por coluna
    const board = columnsResult.rows.map(col => {
      const columnCards = cardsResult.rows
        .filter(card => card.column_id === col.id)
        .map(card => ({
          id: card.id,
          columnId: card.column_id,
          title: card.title,
          description: card.description,
          position: card.position,
          priority: card.priority,
          assignedUserId: card.assigned_user_id,
          assignedUserName: card.assigned_user_name,
          dueDate: card.due_date,
          createdAt: card.created_at,
          updatedAt: card.updated_at
        }));

      return {
        id: col.id,
        workAreaId: col.work_area_id,
        title: col.title,
        position: col.position,
        cards: columnCards
      };
    });

    res.status(HTTP_STATUS.OK).json({
      workArea: {
        id: workAreaData?.id,
        title: workAreaData?.title || 'Quadro Kanban'
      },
      columns: board
    });
  } catch (error) {
    console.error('Get board error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      error: error.message
    });
  }
};

// ============== STATS ==============

const getStats = async (req, res) => {
  try {
    const { workAreaId } = req.params;
    const pool = require('../config/database');

    // Buscar título da área de trabalho
    const workAreaQuery = 'SELECT title FROM work_area WHERE id = $1';
    const workAreaResult = await pool.query(workAreaQuery, [workAreaId]);
    const workAreaTitle = workAreaResult.rows[0]?.title || 'Área de Trabalho';

    // Buscar todas as colunas
    const columnsQuery = 'SELECT id, title FROM kanban_column WHERE work_area_id = $1 ORDER BY position';
    const columnsResult = await pool.query(columnsQuery, [workAreaId]);

    // Buscar todos os cards com informações de usuário
    const cardsQuery = `
      SELECT kc.*, u.name as assigned_user_name
      FROM kanban_card kc
      LEFT JOIN users u ON kc.assigned_user_id = u.id
      INNER JOIN kanban_column kcol ON kc.column_id = kcol.id
      WHERE kcol.work_area_id = $1
    `;
    const cardsResult = await pool.query(cardsQuery, [workAreaId]);

    const totalCards = cardsResult.rows.length;

    // Cards por coluna
    const cardsByColumn = columnsResult.rows.map(col => ({
      columnTitle: col.title,
      count: cardsResult.rows.filter(card => card.column_id === col.id).length
    }));

    // Cards por prioridade
    const priorities = ['alta', 'moderada', 'baixa'];
    const cardsByPriority = priorities.map(priority => ({
      priority,
      count: cardsResult.rows.filter(card => card.priority === priority).length
    }));

    // Cards por usuário
    const userCardsMap = {};
    cardsResult.rows.forEach(card => {
      if (card.assigned_user_name) {
        if (!userCardsMap[card.assigned_user_name]) {
          userCardsMap[card.assigned_user_name] = 0;
        }
        userCardsMap[card.assigned_user_name]++;
      }
    });

    const cardsByUser = Object.entries(userCardsMap).map(([userName, count]) => ({
      userName,
      count
    }));

    // Cards não atribuídos
    const unassignedCards = cardsResult.rows.filter(card => !card.assigned_user_id).length;

    const stats = {
      workAreaTitle,
      totalCards,
      cardsByColumn,
      cardsByPriority,
      cardsByUser,
      unassignedCards
    };

    res.status(HTTP_STATUS.OK).json(stats);
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      error: error.message
    });
  }
};

module.exports = {
  createColumn,
  updateColumn,
  deleteColumn,
  updateColumnPositions,
  createCard,
  updateCard,
  deleteCard,
  updateCardPositions,
  getBoard,
  getStats
};

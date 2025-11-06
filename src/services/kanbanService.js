const KanbanColumnRepository = require('../repositories/KanbanColumnRepository');
const KanbanCardRepository = require('../repositories/KanbanCardRepository');

const columnRepository = new KanbanColumnRepository();
const cardRepository = new KanbanCardRepository();

// ============== COLUMNS ==============

const createColumn = async (columnData) => {
  try {
    const { workAreaId, title, position } = columnData;
    const column = await columnRepository.create({ workAreaId, title, position });
    return { column: column.toJSON() };
  } catch (error) {
    console.error('Create column service error:', error);
    throw error;
  }
};

const updateColumn = async (id, columnData) => {
  try {
    const column = await columnRepository.findById(id);
    if (!column) {
      throw new Error('Coluna não encontrada');
    }

    const updatedColumn = await columnRepository.update(id, columnData);
    return { column: updatedColumn.toJSON() };
  } catch (error) {
    console.error('Update column service error:', error);
    throw error;
  }
};

const deleteColumn = async (id) => {
  try {
    const column = await columnRepository.findById(id);
    if (!column) {
      throw new Error('Coluna não encontrada');
    }

    await columnRepository.delete(id);
    return { success: true };
  } catch (error) {
    console.error('Delete column service error:', error);
    throw error;
  }
};

const getColumnsByWorkArea = async (workAreaId) => {
  try {
    const columns = await columnRepository.findByWorkAreaId(workAreaId);
    return columns.map(col => col.toJSON());
  } catch (error) {
    console.error('Get columns by work area service error:', error);
    throw error;
  }
};

const updateColumnPositions = async (updates) => {
  try {
    await columnRepository.updatePositions(updates);
    return { success: true };
  } catch (error) {
    console.error('Update column positions service error:', error);
    throw error;
  }
};

// ============== CARDS ==============

const createCard = async (cardData) => {
  try {
    const { columnId, title, description, position, priority, assignedUserId, dueDate } = cardData;
    const card = await cardRepository.create({
      columnId,
      title,
      description,
      position,
      priority,
      assignedUserId,
      dueDate
    });
    return { card: card.toJSON() };
  } catch (error) {
    console.error('Create card service error:', error);
    throw error;
  }
};

const updateCard = async (id, cardData) => {
  try {
    const card = await cardRepository.findById(id);
    if (!card) {
      throw new Error('Card não encontrado');
    }

    const updatedCard = await cardRepository.update(id, cardData);
    return { card: updatedCard.toJSON() };
  } catch (error) {
    console.error('Update card service error:', error);
    throw error;
  }
};

const deleteCard = async (id) => {
  try {
    const card = await cardRepository.findById(id);
    if (!card) {
      throw new Error('Card não encontrado');
    }

    await cardRepository.delete(id);
    return { success: true };
  } catch (error) {
    console.error('Delete card service error:', error);
    throw error;
  }
};

const getCardsByWorkArea = async (workAreaId) => {
  try {
    const cards = await cardRepository.findByWorkAreaId(workAreaId);
    return cards.map(card => card.toJSON());
  } catch (error) {
    console.error('Get cards by work area service error:', error);
    throw error;
  }
};

const updateCardPositions = async (updates) => {
  try {
    await cardRepository.updatePositions(updates);
    return { success: true };
  } catch (error) {
    console.error('Update card positions service error:', error);
    throw error;
  }
};

// ============== BOARD (Combined) ==============

const getBoard = async (workAreaId) => {
  try {
    const columns = await columnRepository.findByWorkAreaId(workAreaId);
    const cards = await cardRepository.findByWorkAreaId(workAreaId);

    // Agrupar cards por coluna
    const columnsWithCards = columns.map(col => {
      const columnCards = cards
        .filter(card => card.columnId === col.id)
        .map(card => card.toJSON());

      return {
        ...col.toJSON(),
        cards: columnCards
      };
    });

    return columnsWithCards;
  } catch (error) {
    console.error('Get board service error:', error);
    throw error;
  }
};

module.exports = {
  createColumn,
  updateColumn,
  deleteColumn,
  getColumnsByWorkArea,
  updateColumnPositions,
  createCard,
  updateCard,
  deleteCard,
  getCardsByWorkArea,
  updateCardPositions,
  getBoard
};

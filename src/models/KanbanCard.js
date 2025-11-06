class KanbanCard {
  constructor(id, columnId, title, description, position, priority = 'baixa', assignedUserId = null, dueDate = null, createdAt = new Date(), updatedAt = new Date()) {
    this.id = id;
    this.columnId = columnId;
    this.title = title;
    this.description = description;
    this.position = position;
    this.priority = priority;
    this.assignedUserId = assignedUserId;
    this.dueDate = dueDate;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  toJSON() {
    return {
      id: this.id,
      columnId: this.columnId,
      title: this.title,
      description: this.description,
      position: this.position,
      priority: this.priority,
      assignedUserId: this.assignedUserId,
      dueDate: this.dueDate,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = KanbanCard;

class KanbanColumn {
  constructor(id, workAreaId, title, position, createdAt = new Date(), updatedAt = new Date()) {
    this.id = id;
    this.workAreaId = workAreaId;
    this.title = title;
    this.position = position;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  toJSON() {
    return {
      id: this.id,
      workAreaId: this.workAreaId,
      title: this.title,
      position: this.position,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = KanbanColumn;

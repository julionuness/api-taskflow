class Notification {
  constructor(id, cardId, userId, type, message, isRead = false, createdAt = new Date()) {
    this.id = id;
    this.cardId = cardId;
    this.userId = userId;
    this.type = type; // 'one_week', 'two_days', 'one_day', 'due_today'
    this.message = message;
    this.isRead = isRead;
    this.createdAt = createdAt;
  }

  toJSON() {
    return {
      id: this.id,
      cardId: this.cardId,
      userId: this.userId,
      type: this.type,
      message: this.message,
      isRead: this.isRead,
      createdAt: this.createdAt
    };
  }
}

module.exports = Notification;

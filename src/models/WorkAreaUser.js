class WorkAreaUser {
  constructor(id, userId, workAreaId, isManager = false) {
    this.id = id;
    this.userId = userId; // FK: references User.id
    this.workAreaId = workAreaId; // FK: references WorkArea.id
    this.isManager = isManager;
  }
}

module.exports = WorkAreaUser;
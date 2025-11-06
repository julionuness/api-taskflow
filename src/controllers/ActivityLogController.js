const ActivityLogService = require('../services/ActivityLogService');
const { HTTP_STATUS } = require('../utils/constants');

const activityLogService = new ActivityLogService();

const getWorkAreaActivity = async (req, res) => {
  try {
    const { workAreaId } = req.params;
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    const result = await activityLogService.getWorkAreaActivity(workAreaId, limit, offset);

    res.status(HTTP_STATUS.OK).json(result);
  } catch (error) {
    console.error('Get work area activity error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      error: error.message
    });
  }
};

const getRecentActivity = async (req, res) => {
  try {
    const { workAreaId } = req.params;
    const hours = parseInt(req.query.hours) || 24;

    const activities = await activityLogService.getRecentActivity(workAreaId, hours);

    res.status(HTTP_STATUS.OK).json(activities);
  } catch (error) {
    console.error('Get recent activity error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      error: error.message
    });
  }
};

const getActivityStats = async (req, res) => {
  try {
    const { workAreaId } = req.params;
    const days = parseInt(req.query.days) || 7;

    const stats = await activityLogService.getActivityStats(workAreaId, days);

    res.status(HTTP_STATUS.OK).json(stats);
  } catch (error) {
    console.error('Get activity stats error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      error: error.message
    });
  }
};

const getEntityActivity = async (req, res) => {
  try {
    const { entityType, entityId } = req.params;
    const limit = parseInt(req.query.limit) || 20;

    const activities = await activityLogService.getEntityActivity(entityType, entityId, limit);

    res.status(HTTP_STATUS.OK).json(activities);
  } catch (error) {
    console.error('Get entity activity error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      error: error.message
    });
  }
};

module.exports = {
  getWorkAreaActivity,
  getRecentActivity,
  getActivityStats,
  getEntityActivity
};

const {
  UserNotification,
  FutsalNotification,
  AdminNotification,
} = require("../../models");

// User Notifications
const getUserNotifications = async (req, res) => {
  try {
    const userId = req.userId;
    const { page = 1, limit = 20, unreadOnly = false } = req.query;

    const where = { user_id: userId };
    if (unreadOnly === "true") where.is_read = false;

    const notifications = await UserNotification.findAndCountAll({
      where,
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    });

    res.status(200).json({
      success: true,
      message: "User notifications fetched successfully",
      data: notifications.rows,
      total: notifications.count,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching notifications",
      error: error.message,
    });
  }
};

const getUnreadUserCount = async (req, res) => {
  try {
    const userId = req.userId;

    const count = await UserNotification.count({
      where: { user_id: userId, is_read: false },
    });

    res.status(200).json({
      success: true,
      unreadCount: count,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching unread count",
      error: error.message,
    });
  }
};

const markUserNotificationAsRead = async (req, res) => {
  try {
    const userId = req.userId;
    const { notificationId } = req.params;

    const notification = await UserNotification.findOne({
      where: { id: notificationId, user_id: userId },
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    notification.is_read = true;
    await notification.save();

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: notification,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating notification",
      error: error.message,
    });
  }
};

const markAllUserNotificationsAsRead = async (req, res) => {
  try {
    const userId = req.userId;

    await UserNotification.update(
      { is_read: true },
      { where: { user_id: userId, is_read: false } }
    );

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating notifications",
      error: error.message,
    });
  }
};

const deleteUserNotification = async (req, res) => {
  try {
    const userId = req.userId;
    const { notificationId } = req.params;

    const notification = await UserNotification.findOne({
      where: { id: notificationId, user_id: userId },
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    await notification.destroy();

    res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting notification",
      error: error.message,
    });
  }
};

// Futsal Notifications
const getFutsalNotifications = async (req, res) => {
  try {
    const futsalId = req.futsalId;
    const { page = 1, limit = 20, unreadOnly = false } = req.query;

    const where = { futsal_id: futsalId };
    if (unreadOnly === "true") where.is_read = false;

    const notifications = await FutsalNotification.findAndCountAll({
      where,
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    });

    res.status(200).json({
      success: true,
      message: "Futsal notifications fetched successfully",
      data: notifications.rows,
      total: notifications.count,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching notifications",
      error: error.message,
    });
  }
};

const getUnreadFutsalCount = async (req, res) => {
  try {
    const futsalId = req.futsalId;

    const count = await FutsalNotification.count({
      where: { futsal_id: futsalId, is_read: false },
    });

    res.status(200).json({
      success: true,
      unreadCount: count,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching unread count",
      error: error.message,
    });
  }
};

const markFutsalNotificationAsRead = async (req, res) => {
  try {
    const futsalId = req.futsalId;
    const { notificationId } = req.params;

    const notification = await FutsalNotification.findOne({
      where: { id: notificationId, futsal_id: futsalId },
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    notification.is_read = true;
    await notification.save();

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: notification,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating notification",
      error: error.message,
    });
  }
};

const markAllFutsalNotificationsAsRead = async (req, res) => {
  try {
    const futsalId = req.futsalId;

    await FutsalNotification.update(
      { is_read: true },
      { where: { futsal_id: futsalId, is_read: false } }
    );

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating notifications",
      error: error.message,
    });
  }
};

const deleteFutsalNotification = async (req, res) => {
  try {
    const futsalId = req.futsalId;
    const { notificationId } = req.params;

    const notification = await FutsalNotification.findOne({
      where: { id: notificationId, futsal_id: futsalId },
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    await notification.destroy();

    res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting notification",
      error: error.message,
    });
  }
};

module.exports = {
  getUserNotifications,
  getUnreadUserCount,
  markUserNotificationAsRead,
  markAllUserNotificationsAsRead,
  deleteUserNotification,
  getFutsalNotifications,
  getUnreadFutsalCount,
  markFutsalNotificationAsRead,
  markAllFutsalNotificationsAsRead,
  deleteFutsalNotification,
};

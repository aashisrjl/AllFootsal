const { UserNotification, FutsalNotification, AdminNotification } = require("../../models");

const createUserNotification = async ({
  userId,
  type,
  title,
  message,
  relatedId = null,
  relatedType = null,
}) => {
  try {
    const notification = await UserNotification.create({
      user_id: userId,
      type,
      title,
      message,
      related_id: relatedId,
      related_type: relatedType,
      is_read: false,
    });
    return notification;
  } catch (error) {
    console.error("Error creating user notification:", error);
    return null;
  }
};

const createFutsalNotification = async ({
  futsalId,
  type,
  title,
  message,
  relatedId = null,
  relatedType = null,
}) => {
  try {
    const notification = await FutsalNotification.create({
      futsal_id: futsalId,
      type,
      title,
      message,
      related_id: relatedId,
      related_type: relatedType,
      is_read: false,
    });
    return notification;
  } catch (error) {
    console.error("Error creating futsal notification:", error);
    return null;
  }
};

const createAdminNotification = async ({
  type,
  title,
  message,
  severity = "info",
  relatedId = null,
  relatedType = null,
}) => {
  try {
    const notification = await AdminNotification.create({
      type,
      title,
      message,
      severity,
      related_id: relatedId,
      related_type: relatedType,
      is_read: false,
    });
    return notification;
  } catch (error) {
    console.error("Error creating admin notification:", error);
    return null;
  }
};

const markAsRead = async (notificationType, notificationId) => {
  try {
    let model;
    if (notificationType === "user") model = UserNotification;
    else if (notificationType === "futsal") model = FutsalNotification;
    else if (notificationType === "admin") model = AdminNotification;
    else return null;

    const notification = await model.findByPk(notificationId);
    if (notification) {
      notification.is_read = true;
      await notification.save();
      return notification;
    }
    return null;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return null;
  }
};

const markAllAsRead = async (notificationType, userId = null, futsalId = null) => {
  try {
    let model;
    let where = {};

    if (notificationType === "user") {
      model = UserNotification;
      where = { user_id: userId };
    } else if (notificationType === "futsal") {
      model = FutsalNotification;
      where = { futsal_id: futsalId };
    }

    if (!model) return null;

    const updated = await model.update(
      { is_read: true },
      { where, returning: true }
    );

    return updated[1];
  } catch (error) {
    console.error("Error marking all as read:", error);
    return null;
  }
};

const deleteNotification = async (notificationType, notificationId) => {
  try {
    let model;
    if (notificationType === "user") model = UserNotification;
    else if (notificationType === "futsal") model = FutsalNotification;
    else if (notificationType === "admin") model = AdminNotification;
    else return null;

    const deleted = await model.destroy({ where: { id: notificationId } });
    return deleted > 0;
  } catch (error) {
    console.error("Error deleting notification:", error);
    return false;
  }
};

const getUnreadCount = async (notificationType, userId = null, futsalId = null) => {
  try {
    let model;
    let where = { is_read: false };

    if (notificationType === "user") {
      model = UserNotification;
      where.user_id = userId;
    } else if (notificationType === "futsal") {
      model = FutsalNotification;
      where.futsal_id = futsalId;
    }

    if (!model) return 0;

    const count = await model.count({ where });
    return count;
  } catch (error) {
    console.error("Error getting unread count:", error);
    return 0;
  }
};

module.exports = {
  createUserNotification,
  createFutsalNotification,
  createAdminNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
};

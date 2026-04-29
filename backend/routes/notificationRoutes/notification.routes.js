const express = require('express');
const router = express.Router();
const {
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
} = require('../../controllers/notificationController/notificationController');
const isUserAuthenticated = require('../../middleware/authMiddleware/userAuthenticate');
const isFutsalAuthenticated = require('../../middleware/authMiddleware/futsalAuthenticated');

// ── User Notification Routes ───────────────────────────────────────────────
router.get(
  '/user/notifications', // #swagger.tags=['Notifications']
  isUserAuthenticated,
  getUserNotifications
);

router.get(
  '/user/notifications/unread-count', // #swagger.tags=['Notifications']
  isUserAuthenticated,
  getUnreadUserCount
);

router.patch(
  '/user/notifications/:notificationId/read', // #swagger.tags=['Notifications']
  isUserAuthenticated,
  markUserNotificationAsRead
);

router.patch(
  '/user/notifications/read-all', // #swagger.tags=['Notifications']
  isUserAuthenticated,
  markAllUserNotificationsAsRead
);

router.delete(
  '/user/notifications/:notificationId', // #swagger.tags=['Notifications']
  isUserAuthenticated,
  deleteUserNotification
);

// ── Futsal Notification Routes ─────────────────────────────────────────────
router.get(
  '/futsal/notifications', // #swagger.tags=['Notifications']
  isFutsalAuthenticated,
  getFutsalNotifications
);

router.get(
  '/futsal/notifications/unread-count', // #swagger.tags=['Notifications']
  isFutsalAuthenticated,
  getUnreadFutsalCount
);

router.patch(
  '/futsal/notifications/:notificationId/read', // #swagger.tags=['Notifications']
  isFutsalAuthenticated,
  markFutsalNotificationAsRead
);

router.patch(
  '/futsal/notifications/read-all', // #swagger.tags=['Notifications']
  isFutsalAuthenticated,
  markAllFutsalNotificationsAsRead
);

router.delete(
  '/futsal/notifications/:notificationId', // #swagger.tags=['Notifications']
  isFutsalAuthenticated,
  deleteFutsalNotification
);

module.exports = router;

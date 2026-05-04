const express = require('express')
const { toggleForumLike, toggleReplyLike, countLikesByForumId, countLikesByReplyId, deleteForumLike, deleteReplyLike } = require('../../controllers/forumControllers/forumLike.controller')
const isBothAuthenticated = require('../../middleware/authMiddleware/bothAuthenticated')
const router = express.Router()

router.post(
    '/forum/:forumId/create/like', // #swagger.tags=['Forum/Like']
    isBothAuthenticated,
    toggleForumLike
)

router.post(
    '/forum/reply/:replyId/create/like', // #swagger.tags=['Forum/Like']
    isBothAuthenticated,
    toggleReplyLike
)

router.get(
    '/forum/likes/:forumId', // #swagger.tags=['Forum/Like']
    isBothAuthenticated,
    countLikesByForumId
)

router.get(
    '/forum/reply/likes/:replyId', // #swagger.tags=['Forum/Like']
    isBothAuthenticated,
    countLikesByReplyId
)

router.delete(
    '/forum/:forumId/like', // #swagger.tags=['Forum/Like']
    isBothAuthenticated,
    deleteForumLike
)

router.delete(
    '/forum/reply/:replyId/like', // #swagger.tags=['Forum/Like']
    isBothAuthenticated,
    deleteReplyLike
)

module.exports = router
const express = require('express')
const { createForumLike, createReplyLike, countLikesByForumId, countLikesByReplyId } = require('../../controllers/forumControllers/forumLike.controller')
const isBothAuthenticated = require('../../middleware/authMiddleware/bothAuthenticated')
const router = express.Router()

router.post(
    '/forum/:forumId/create/like', // #swagger.tags=['Forum/Like']
    isBothAuthenticated,
    createForumLike
)

router.post(
    '/forum/reply/:replyId/create/like', // #swagger.tags=['Forum/Like']
    isBothAuthenticated,
    createReplyLike
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
module.exports = router
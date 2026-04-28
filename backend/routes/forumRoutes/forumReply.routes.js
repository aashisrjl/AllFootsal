const express = require("express")
const { createForumReply, getRepliesByForumId, getRepliesByUserIdOrFutsalId, deleteForumReply } = require("../../controllers/forumControllers/forumReply.controller")
const isBothAuthenticated = require("../../middleware/authMiddleware/bothAuthenticated")
const router = express.Router()

router.post(
    '/forum/:forumId/reply/create', //#swagger.tags=['Forum Replies']
    isBothAuthenticated,
    createForumReply
)

router.get(
    '/forum/:forumId/reply', //#swagger.tags=['Forum Replies']
    isBothAuthenticated,
    getRepliesByForumId
)

router.get(
    '/forum-reply', //#swagger.tags=['Forum Replies']
    isBothAuthenticated,
    getRepliesByUserIdOrFutsalId
)

router.delete(
    '/forum/reply/:replyId', //#swagger.tags=['Forum Replies']
    isBothAuthenticated,
    deleteForumReply
)

module.exports = router
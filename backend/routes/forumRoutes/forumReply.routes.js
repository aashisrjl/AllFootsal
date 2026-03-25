const express = require("express")
const { createForumReply, getRepliesByForumId, getRepliesByUserIdOrFutsalId } = require("../../controllers/forumControllers/forumReply.controller")
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
    '/forum/reply', //#swagger.tags=['Forum Replies']
    isBothAuthenticated,
    getRepliesByUserIdOrFutsalId
)




module.exports = router
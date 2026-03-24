const express = require("express")
const { createForumReply, getRepliesByForumId, getRepliesByUserIdOrFutsalId } = require("../../controllers/forumControllers/forumReply.controller")
const router = express.Router()

router.post(
    '/forum/reply/create', //#swagger.tags=['Forum Replies']
    isBothAuthenticated,
    createForumReply
)

router.get(
    '/forum/reply/:forumId', //#swagger.tags=['Forum Replies']
    isBothAuthenticated,
    getRepliesByForumId
)

router.get(
    '/forum/reply', //#swagger.tags=['Forum Replies']
    isBothAuthenticated,
    getRepliesByUserIdOrFutsalId
)




module.exports = router
const express = require("express")
const { createForumReply, getRepliesByForumId, getRepliesByUserIdOrFutsalId } = require("../../controllers/forumControllers/forumReply.controller")
const router = express.Router()

router.post(
    '/forum/reply/create',
    createForumReply
)

router.get(
    '/forum/reply/:forumId',
    getRepliesByForumId
)

router.get(
    '/forum/reply',
    isBothAuthenticated,
    getRepliesByUserIdOrFutsalId
)




module.exports = router
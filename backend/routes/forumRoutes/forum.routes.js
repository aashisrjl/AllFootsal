const express = require('express')
const { createForum, getAllForums, getForumsByUserId, getForumsByFutsalId, getForumsByCategory, getForumById, getForumBySlug } = require('../../controllers/forumControllers/forum.controller')
const isBothAuthenticated = require('../../middleware/authMiddleware/bothAuthenticated')
const isUserAuthenticated = require('../../middleware/authMiddleware/userAuthenticate')
const isFutsalAuthenticated = require('../../middleware/authMiddleware/futsalAuthenticated')
const router = express.Router()

router.post(
    '/forum/create', // #swagger.tags=['Forum']
    isBothAuthenticated,
    createForum
)

router.get(
    '/forums', // #swagger.tags=['Forum']
    isBothAuthenticated,
    getAllForums
)

router.get(
    '/forum/user0', // #swagger.tags=['Forum']
    isUserAuthenticated,
    getForumsByUserId
)

router.get(
    '/forum/futsal0', // #swagger.tags=['Forum']
    isFutsalAuthenticated,
    getForumsByFutsalId
)

router.get(
    //query parameter?category=help
    '/forums', // #swagger.tags=['Forum']
    isBothAuthenticated,
    getForumsByCategory
)

router.get(
    //params
    '/forum/:forumId',// #swagger.tags=['Forum']
    isBothAuthenticated,
    getForumById
)

router.get(
    '/forum/:slug',// #swagger.tags=['Forum']
    isBothAuthenticated,
    getForumBySlug
)

module.exports = router
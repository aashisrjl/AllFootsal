const FORUM_ORDER = [["createdAt", "DESC"], ["id", "DESC"]];

//create 
const { Op } = require('sequelize');
const { Forum, User, ForumReply, ForumLike, sequelize } = require('../../models');

const deleteForumCascade = async (forumId, transaction) => {
    const replies = await ForumReply.findAll({
        where: { forum_id: forumId },
        attributes: ['id'],
        raw: true,
        transaction,
    });

    const replyIds = replies.map((reply) => reply.id);

    await ForumLike.destroy({
        where: { forum_id: forumId },
        transaction,
    });

    if (replyIds.length > 0) {
        await ForumLike.destroy({
            where: { reply_id: { [Op.in]: replyIds } },
            transaction,
        });
    }

    await ForumReply.destroy({
        where: { forum_id: forumId },
        transaction,
    });

    await Forum.destroy({
        where: { id: forumId },
        transaction,
    });
};

const ensureForumCreatorExists = async (forum) => {
    if (!forum || !forum.user_id) {
        return forum;
    }

    if (forum.user) {
        return forum;
    }

    const creator = await User.findByPk(forum.user_id);
    if (creator) {
        return forum;
    }

    await sequelize.transaction(async (transaction) => {
        await deleteForumCascade(forum.id, transaction);
    });

    return null;
};

const createForum = async (req,res)=>{
    const {title, content,slug, category} = req.body;

    const userId = req?.userId;
    const futsalId = req?.futsalId;
    try {
        const newForum = await Forum.create({
            title,
            content,
            slug,
            category,
            user_id: userId,
            futsal_id: futsalId
        });

        try {
            if (userId) {
                const { createUserNotification } = require("../../services/notifications/notificationService");
                await createUserNotification({
                    userId: userId,
                    type: "general_notification",
                    title: "Forum Post Published 🎉",
                    message: `Your post "${title}" is now live!`,
                    relatedId: newForum.id,
                    relatedType: "forum",
                }).catch(console.error);
            } else if (futsalId) {
                const { createFutsalNotification } = require("../../services/notifications/notificationService");
                await createFutsalNotification({
                    futsalId: futsalId,
                    type: "forum_activity",
                    title: "Forum Post Published 🎉",
                    message: `Your post "${title}" is now live!`,
                    relatedId: newForum.id,
                    relatedType: "forum",
                }).catch(console.error);
            }
        } catch (notifyErr) {
            console.error("Error sending forum creation notification:", notifyErr);
        }

        res.status(201).json({
            success:true,
            message:"Forum created successfully",
            data:newForum
        });

    } catch (error) {
        console.error("Error creating forum:", error);
        res.status(500).json({ error: "Failed to create forum" });
    }   
}

//get all forums
const getAllForums = async (req,res)=>{
    try {
        const forums = await Forum.findAll({ order: FORUM_ORDER });
        const visibleForums = [];

        for (const forum of forums) {
            const cleanedForum = await ensureForumCreatorExists(forum);
            if (cleanedForum) {
                visibleForums.push(cleanedForum);
            }
        }

        if(visibleForums.length === 0){
            return res.status(404).json({
                success:false,
                message:"No forums found"});
        }
        res.status(200).json({
            success: true,
            message: "Forums fetched successfully",
            data: visibleForums
        });
    } catch (error) {
        console.error("Error fetching forums:", error);
        res.status(500).json({ error: "Failed to fetch forums" });
    }
}

//get forum by userId

const getForumsByUserId = async (req,res)=>{
    const userId = req?.userId;
    if(!userId){
        return res.status(400).json({
            success:false,
            message:"User ID is required"});
    }
    try {
        const forums = await Forum.findAll({
            where:{user_id:userId},
            order: FORUM_ORDER
        });
        const visibleForums = [];

        for (const forum of forums) {
            const cleanedForum = await ensureForumCreatorExists(forum);
            if (cleanedForum) {
                visibleForums.push(cleanedForum);
            }
        }

        if(visibleForums.length === 0){
            return res.status(404).json({
                success:false,
                message:"No forums found for this user"});
        }
        res.status(200).json({  
            success:true,
            message:"Forums fetched successfully",
            data:visibleForums
        });
    } catch (error) {
        console.error("Error fetching forums by user ID:", error);
        res.status(500).json({ error: "Failed to fetch forums" });
    }       
}

//get forum by futsalId 
const getForumsByFutsalId = async (req,res)=>{
    const futsalId = req?.futsalId;
    if(!futsalId){
        return res.status(400).json({
            success:false,
            message:"Futsal ID is required"});
    }
    try {
        const forums = await Forum.findAll({
            where:{futsal_id:futsalId},
            order: FORUM_ORDER,
            include: [{
                model: User,
                as: 'user',
                attributes: ['username']
            }]
        });
        const visibleForums = [];

        for (const forum of forums) {
            const cleanedForum = await ensureForumCreatorExists(forum);
            if (cleanedForum) {
                visibleForums.push(cleanedForum);
            }
        }

        if(visibleForums.length === 0){
            return res.status(404).json({
                success:false,
                message:"No forums found for this futsal"});
        }
        // Map to include user_name
        const forumsWithUser = visibleForums.map(forum => ({
            ...forum.toJSON(),
            user_name: forum.user?.username || 'Anonymous'
        }));
        res.status(200).json({  
            success:true,
            message:"Forums fetched successfully",
            data:forumsWithUser
        });
    } catch (error) {
        console.error("Error fetching forums by futsal ID:", error);
        res.status(500).json({ error: "Failed to fetch forums" });
    }
}


//get forum by category
const getForumsByCategory = async (req,res)=>{
    const category = req.query?.category;
    if(!category){
        return res.status(400).json({
            success:false,
            message:"Category is required"});
    }
    try {
        const forums = await Forum.findAll({
            where:{category},
            order: FORUM_ORDER
        });
        const visibleForums = [];

        for (const forum of forums) {
            const cleanedForum = await ensureForumCreatorExists(forum);
            if (cleanedForum) {
                visibleForums.push(cleanedForum);
            }
        }

        if(visibleForums.length === 0){
            return res.status(404).json({
                success:false,
                message:"No forums found for this category"});
        }
        res.status(200).json({  
            success:true,
            message:"Forums fetched by Category successfully",
            data:visibleForums
        });
    } catch (error) {
        console.error("Error fetching forums by category:", error);
        res.status(500).json({ error: "Failed to fetch forums" });
    }   
}

//get forum by id
const getForumById = async (req,res)=>{
    const forumId = req.params.forumId;
    if(!forumId){
        return res.status(400).json({
            success:false,
            message:"Forum ID is required"});
    }
    try {
        const forum = await Forum.findByPk(forumId);
        const visibleForum = await ensureForumCreatorExists(forum);
        if(!visibleForum){
            return res.status(404).json({
                success:false,
                message:"Forum not found or creator no longer exists"});
        }       
        res.status(200).json({  
            success:true,
            message:"Forum fetched successfully",
            data:visibleForum
        });
    } catch (error) {   
        console.error("Error fetching forum by ID:", error);
        res.status(500).json({ error: "Failed to fetch forum" });
    }
}

//get forum by slug
const getForumBySlug = async (req,res)=>{
    const slug = req.params.slug;
    if(!slug){
        return res.status(400).json({
            success:false,
            message:"Forum slug is required"});
    }
    try {
        const forum = await Forum.findOne({where:{slug}});
        const visibleForum = await ensureForumCreatorExists(forum);
        if(!visibleForum){
            return res.status(404).json({
                success:false,
                message:"Forum not found or creator no longer exists"});
        }       
        res.status(200).json({  
            success:true,
            message:"Forum fetched successfully",
            data:visibleForum
        });
    } catch (error) {   
        console.error("Error fetching forum by slug:", error);
        res.status(500).json({ error: "Failed to fetch forum" });
    }
}

// delete forum
const deleteForum = async (req, res) => {
    const forumId = req.params.forumId;
    const userId = req?.userId;
    const futsalId = req?.futsalId;

    if (!forumId) {
        return res.status(400).json({
            success: false,
            message: "Forum ID is required"
        });
    }

    try {
        const forum = await Forum.findByPk(forumId);

        if (!forum) {
            return res.status(404).json({
                success: false,
                message: "Forum not found"
            });
        }

        // Check authorization - only creator or futsal owner can delete
        if (forum.user_id !== userId && forum.futsal_id !== futsalId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this forum"
            });
        }

        await sequelize.transaction(async (transaction) => {
            await deleteForumCascade(forumId, transaction);
        });

        res.status(200).json({
            success: true,
            message: "Forum deleted successfully",
            data: { id: forumId }
        });
    } catch (error) {
        console.error("Error deleting forum:", error);
        res.status(500).json({
            success: false,
            message: "Error deleting forum",
            error: error.message
        });
    }
};

module.exports = {
    createForum,
    getAllForums,
    getForumsByUserId,  
    getForumsByFutsalId,
    getForumsByCategory,
    getForumById,
    getForumBySlug,
    deleteForum
}

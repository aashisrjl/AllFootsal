const { Forum, ForumReply, User, Footsal } = require("../../models");
const sendEmail = require("../../services/mail/sendEmail");

//create forum reply
const createForumReply = async (req,res)=>{
    const forumId = req.params.forumId;
    const {content} = req.body;
    const userId = req?.userId;
    const futsalId = req?.futsalId;
    try {
        if (!content || !content.trim()) {
            return res.status(400).json({
                success: false,
                message: "Reply content is required"
            });
        }

        const forum = await Forum.findByPk(forumId);

        if (!forum) {
            return res.status(404).json({
                success: false,
                message: "Forum not found"
            });
        }

        if (forum.is_locked) {
            return res.status(403).json({
                success: false,
                message: "This forum is locked"
            });
        }

        const newReply = await ForumReply.create({
            content,
            is_solution:false,
            user_id:userId,
            footsal_id:futsalId,
            forum_id:forumId
        });

        try {
            let recipientEmail = null;
            let recipientName = "Forum owner";

            if (forum.user_id) {
                const forumOwner = await User.findByPk(forum.user_id);
                recipientEmail = forumOwner?.email || null;
                recipientName = forumOwner?.username || recipientName;

                // Fire in-app user notification if someone else replied
                if (forum.user_id != userId) {
                    const { createUserNotification } = require("../../services/notifications/notificationService");
                    await createUserNotification({
                        userId: forum.user_id,
                        type: "forum_reply",
                        title: "New Reply on Your Post 💬",
                        message: `Someone replied: "${content.substring(0, 50)}${content.length > 50 ? '...' : ''}"`,
                        relatedId: forum.id,
                        relatedType: "forum_reply",
                    }).catch(console.error);
                }

            } else if (forum.futsal_id) {
                const forumOwner = await Footsal.findByPk(forum.futsal_id);
                recipientEmail = forumOwner?.email || null;
                recipientName = forumOwner?.futsalName || recipientName;

                // Fire in-app futsal notification if someone else replied
                if (forum.futsal_id != futsalId) {
                    const { createFutsalNotification } = require("../../services/notifications/notificationService");
                    await createFutsalNotification({
                        futsalId: forum.futsal_id,
                        type: "forum_reply",
                        title: "New Forum Reply 💬",
                        message: `Someone replied to your post: "${content.substring(0, 50)}${content.length > 50 ? '...' : ''}"`,
                        relatedId: forum.id,
                        relatedType: "forum_reply",
                    }).catch(console.error);
                }
            }

            if (recipientEmail) {
                await sendEmail({
                    option: {
                        to: recipientEmail,
                        subject: "New reply on your forum post",
                        text: `Hello ${recipientName},\n\nA new reply has been posted on your forum post titled "${forum.title}".\n\nReply: ${content}\n\nPlease log in to review and respond if needed.`,
                    },
                });
            }
        } catch (notificationError) {
            console.error("Error sending forum reply notification:", notificationError);
        }

        res.status(201).json({
            success:true,
            message:"Reply created successfully",
            data:newReply
        });
    }catch(err){
        return res.status(500).json({
            success:false,
            message:"Error creating reply",
            error:err.message
        });
    }
}

const getRepliesByForumId = async (req,res)=>{
    const forumId = req.params.forumId;
    try {
        const replies = await ForumReply.findAll({where:{forum_id:forumId}});
        res.status(200).json({
            success:true,
            message:"Replies fetched successfully",
            data:replies
        });
    } catch (error) {
        console.error("Error fetching replies:", error);
        res.status(500).json({ error: "Failed to fetch replies" });
    }
}

const getRepliesByUserIdOrFutsalId = async (req,res)=>{
    const userId = req?.userId;
    const futsalId = req?.futsalId;
    if(!userId && !futsalId){
        return res.status(400).json({
            success:false,
            message:"User ID or Futsal ID is required"
        });
    }
    try {
        if(userId){
        const userreplies = await ForumReply.findAll({where:{user_id:userId}});
        res.status(200).json({
            success:true,
            message:"Replies fetched successfully",
            data:userreplies
        });
    }
        if(futsalId){

        const futsalReplies = await ForumReply.findAll({where:{futsal_id:futsalId}});
        res.status(200).json({
            success:true,
            message:"Replies fetched successfully",
            data:futsalReplies
        });
    }
    } catch (error) {
        console.error("Error fetching replies:", error);
        res.status(500).json({ error: "Failed to fetch replies" });
    }
}

// delete forum reply
const deleteForumReply = async (req, res) => {
    const replyId = req.params.replyId;
    const userId = req?.userId;
    const futsalId = req?.futsalId;

    if (!replyId) {
        return res.status(400).json({
            success: false,
            message: "Reply ID is required"
        });
    }

    try {
        const reply = await ForumReply.findByPk(replyId);

        if (!reply) {
            return res.status(404).json({
                success: false,
                message: "Reply not found"
            });
        }

        // Check authorization - only creator or futsal owner can delete
        if (reply.user_id !== userId && reply.footsal_id !== futsalId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this reply"
            });
        }

        // Delete associated likes for this reply
        const { ForumLike } = require("../../models");
        await ForumLike.destroy({
            where: { reply_id: replyId }
        });

        // Delete the reply
        await reply.destroy();

        res.status(200).json({
            success: true,
            message: "Reply deleted successfully",
            data: { id: replyId }
        });
    } catch (error) {
        console.error("Error deleting reply:", error);
        res.status(500).json({
            success: false,
            message: "Error deleting reply",
            error: error.message
        });
    }
};

module.exports = {
    createForumReply,
    getRepliesByForumId,
    getRepliesByUserIdOrFutsalId,
    deleteForumReply
}

const {Forum} = require("../../models");
const {ForumReply} = require("../../models");

//create forum reply
const createForumReply = async (req,res)=>{
    const forumId = req.params.forumId;
    const {content} = req.body;
    const userId = req?.userId;
    const futsalId = req?.futsalId;
    try {
        const newReply = await ForumReply.create({
            content,
            is_solution:false,
            user_id:userId,
            footsal_id:futsalId,
            forum_id:forumId
        });
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
        const replies = await ForumReply.findAll({where:{user_id:userId, footsal_id:futsalId}});
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


module.exports = {
    createForumReply,
    getRepliesByForumId,
    getRepliesByUserIdOrFutsalId
}

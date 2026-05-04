const { ForumLike } = require("../../models");

// create a like
const createForumLike = async (req, res) => {
  const forumId = req.params.forumId;
  const userId = req?.userId;
  const futsalId = req?.futsalId;
  //handle duplicated like by same user for same reply
  if(userId){
  const existingLike = await ForumLike.findOne({
    where: { forum_id: forumId, user_id: userId },
  });
  if (existingLike) {
    return res.status(400).json({
      success: false,
      message: "You have already liked this forum",
    });
  }
}

if(futsalId){
  const existingFutsalLike = await ForumLike.findOne({
    where: { forum_id: forumId, futsal_id: futsalId },
  });
  if (existingFutsalLike) {
    return res.status(400).json({
      success: false,
      message: "You have already liked this forum with the same futsal",
    });
  }
}

  try {
    const newLike = await ForumLike.create({
      forum_id: forumId,
      user_id: userId,
      futsal_id: futsalId,
    });
    res.status(201).json({
      success: true,
      message: "Like created successfully",
      data: newLike,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error creating like",
      error: err.message,
    });
  }
};

const createReplyLike = async (req, res) => {
  const replyId = req.params.replyId;
  const userId = req?.userId;
  const futsalId = req?.futsalId;

  //handle duplicated like by same user for same reply
  if(userId){
  const existingLike = await ForumLike.findOne({
    where: { reply_id: replyId, user_id: userId },
  });
  if (existingLike) {
    return res.status(400).json({
      success: false,
      message: "You have already liked this reply",
    });
  }
}

if(futsalId){
  const existingFutsalLike = await ForumLike.findOne({
    where: { reply_id: replyId, futsal_id: futsalId },
  });
  if (existingFutsalLike) {
    return res.status(400).json({
      success: false,
      message: "You have already liked this reply with the same futsal",
    });
  }
}
  try {
    const newLike = await ForumLike.create({
      reply_id: replyId,
      user_id: userId,
      futsal_id: futsalId,
    });
    res.status(201).json({
      success: true,
      message: "Like created successfully",
      data: newLike,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error creating like",
      error: err.message,
    });
  }
};

const countLikesByForumId = async (req, res) => {
  const forumId = req.params.forumId;
  try {
    const likes = await ForumLike.findAll({ where: { forum_id: forumId } });
    res.status(200).json({
      success: true,
      message: "Likes fetched successfully",
      data: likes,
    });
  } catch (error) {
    console.error("Error fetching likes:", error);
    res.status(500).json({ error: "Failed to fetch likes" });
  }
};

const countLikesByReplyId = async (req, res) => {
  const replyId = req.params.replyId;
  try {
    const likes = await ForumLike.findAll({ where: { reply_id: replyId } });
    res.status(200).json({
      success: true,
      message: "Likes fetched successfully",
      data: likes,
    });
  } catch (error) {
    console.error("Error fetching likes:", error);
    res.status(500).json({ error: "Failed to fetch likes" });
  }
};

// delete forum like
const deleteForumLike = async (req, res) => {
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
    let like;
    
    if (userId) {
      like = await ForumLike.findOne({
        where: { forum_id: forumId, user_id: userId }
      });
    } else if (futsalId) {
      like = await ForumLike.findOne({
        where: { forum_id: forumId, futsal_id: futsalId }
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "User ID or Futsal ID is required"
      });
    }

    if (!like) {
      return res.status(404).json({
        success: false,
        message: "Like not found"
      });
    }

    await like.destroy();

    res.status(200).json({
      success: true,
      message: "Like deleted successfully",
      data: { id: like.id }
    });
  } catch (error) {
    console.error("Error deleting like:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting like",
      error: error.message
    });
  }
};

// delete reply like
const deleteReplyLike = async (req, res) => {
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
    let like;
    
    if (userId) {
      like = await ForumLike.findOne({
        where: { reply_id: replyId, user_id: userId }
      });
    } else if (futsalId) {
      like = await ForumLike.findOne({
        where: { reply_id: replyId, futsal_id: futsalId }
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "User ID or Futsal ID is required"
      });
    }

    if (!like) {
      return res.status(404).json({
        success: false,
        message: "Like not found"
      });
    }

    await like.destroy();

    res.status(200).json({
      success: true,
      message: "Like deleted successfully",
      data: { id: like.id }
    });
  } catch (error) {
    console.error("Error deleting like:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting like",
      error: error.message
    });
  }
};

// toggle forum like
const toggleForumLike = async (req, res) => {
  const forumId = req.params.forumId;
  const userId = req?.userId;
  const futsalId = req?.futsalId;

  if (!forumId) {
    return res.status(400).json({ success: false, message: "Forum ID is required" });
  }

  try {
    let existingLike;
    if (userId) {
      existingLike = await ForumLike.findOne({ where: { forum_id: forumId, user_id: userId } });
    } else if (futsalId) {
      existingLike = await ForumLike.findOne({ where: { forum_id: forumId, futsal_id: futsalId } });
    }

    if (existingLike) {
      await existingLike.destroy();
      return res.status(200).json({
        success: true,
        message: "Unliked successfully",
        action: "unliked",
        data: { forumId }
      });
    } else {
      const newLike = await ForumLike.create({
        forum_id: forumId,
        user_id: userId,
        futsal_id: futsalId,
      });
      return res.status(201).json({
        success: true,
        message: "Liked successfully",
        action: "liked",
        data: newLike,
      });
    }
  } catch (err) {
    console.error("Error toggling forum like:", err);
    return res.status(500).json({
      success: false,
      message: "Error toggling like",
      error: err.message,
    });
  }
};

// toggle reply like
const toggleReplyLike = async (req, res) => {
  const replyId = req.params.replyId;
  const userId = req?.userId;
  const futsalId = req?.futsalId;

  if (!replyId) {
    return res.status(400).json({ success: false, message: "Reply ID is required" });
  }

  try {
    let existingLike;
    if (userId) {
      existingLike = await ForumLike.findOne({ where: { reply_id: replyId, user_id: userId } });
    } else if (futsalId) {
      existingLike = await ForumLike.findOne({ where: { reply_id: replyId, futsal_id: futsalId } });
    }

    if (existingLike) {
      await existingLike.destroy();
      return res.status(200).json({
        success: true,
        message: "Unliked successfully",
        action: "unliked",
        data: { replyId }
      });
    } else {
      const newLike = await ForumLike.create({
        reply_id: replyId,
        user_id: userId,
        futsal_id: futsalId,
      });
      return res.status(201).json({
        success: true,
        message: "Liked successfully",
        action: "liked",
        data: newLike,
      });
    }
  } catch (err) {
    console.error("Error toggling reply like:", err);
    return res.status(500).json({
      success: false,
      message: "Error toggling like",
      error: err.message,
    });
  }
};

module.exports = {
  createForumLike,
  createReplyLike,
  countLikesByForumId,
  countLikesByReplyId,
  deleteForumLike,
  deleteReplyLike,
  toggleForumLike,
  toggleReplyLike
};

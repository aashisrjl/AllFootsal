
//futsal side ratings and review controller
const getRatings = async (req,res) => {
    const futsalCode = req.futsalCode;
    const ratings = await sequelize.query(
        `SELECT r.rating, r.review, r.createdAt, u.name as reviewerName
         FROM ratings_${futsalCode} r
         JOIN users u ON r.user_id = u.id
         ORDER BY r.createdAt DESC`,
        {
            type: QueryTypes.SELECT,
        }
    );
    if(!ratings[0]){
        return res.status(400).json({
            success:false,
            message:"No ratings found for this futsal"
        })
    }
    res.status(200).json({
        success:true,
        message:"Ratings fetched successfully",
        data:ratings
    })
}

//by user side, post rating and review for a futsal
const postRating = async (req,res) => {
    const {code} = req.tanent;
    const userId = req.userId;
    const {rating, review} = req.body;

    if(!rating || rating < 1 || rating > 5){
        return res.status(400).json({
            success:false,
            message:"Rating must be between 1 and 5"
        })
    }

    await sequelize.query(
        `INSERT INTO ratings_${code} (user_id, rating, review)
         VALUES (?, ?, ?)`,
        {
            replacements: [userId, rating, review],
            type: QueryTypes.INSERT,
        }
    );

    res.status(201).json({
        success:true,
        message:"Rating and review posted successfully"
    })
}

const updateRating = async (req,res) => {
    const {code} = req.tanent;
    const userId = req.userId;
    const {rating, review} = req.body;

    if(!rating || rating < 1 || rating > 5){
        return res.status(400).json({
            success:false,
            message:"Rating must be between 1 and 5"
        })
    }

    await sequelize.query(
        `UPDATE ratings_${futsalCode}
         SET rating = ?, review = ?
         WHERE user_id = ?`,
        {
            replacements: [rating, review, userId],
            type: QueryTypes.UPDATE,
        }
    );

    res.status(200).json({
        success:true,
        message:"Rating and review updated successfully"
    })
}

const deleteRating = async (req,res) => {
    const {code} = req.tanent;
    const userId = req.userId;

    await sequelize.query(
        `DELETE FROM ratings_${code}
         WHERE user_id = ?`,
        {
            replacements: [userId],
            type: QueryTypes.DELETE,
        }
    );

    res.status(200).json({
        success:true,
        message:"Rating and review deleted successfully"
    })
}

const deleteRatingByAdmin = async (req,res) => {
    const futsalCode = req.futsalCode;
    const ratingId = req.params.ratingId;

    await sequelize.query(
        `DELETE FROM ratings_${futsalCode}
         WHERE id = ?`,
        {
            replacements: [ratingId],
            type: QueryTypes.DELETE,
        }
    );

    res.status(200).json({
        success:true,
        message:"Rating and review deleted successfully by admin"
    })
}

//get all ratings nd review but the own is in first and then the rest of the ratings and review
const getRatingByUser = async (req,res) =>{
    const {code} = req.tanent;
    const userId = req.userId;

    const rating = await sequelize.query(
        `SELECT r.rating, r.review, r.createdAt, u.name as reviewerName
         FROM ratings_${code} r
         JOIN users u ON r.user_id = u.id
         WHERE r.user_id = ?
         ORDER BY r.createdAt DESC`,
        {
            replacements: [userId],
            type: QueryTypes.SELECT,
        }
    );

    if(!rating[0]){
        return res.status(400).json({
            success:false,
            message:"No rating found for this user"
        })
    }

    res.status(200).json({
        success:true,
        message:"Rating fetched successfully",
        data:rating[0]
    })
}



module.exports = {
    getRatings, //futaL
    getRatingByUser, // USER
    postRating, //USER
    updateRating, // USER 
    deleteRating, //USER
    deleteRatingByAdmin //ADMIN
}
 

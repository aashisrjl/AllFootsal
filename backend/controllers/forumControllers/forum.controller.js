//create 
const {Forum} = require('../../models');

const createForum = async (req,res)=>{
    const {title, content,slug, category} = req.body;
     
    if(!title || !content || !slug || !category){
        return res.status(400).json({
            success:false,
            message:"Title, content, slug and category are required"});
    }
    const userId = req.userId;
    if(!userId) {
        return res.status(400).json({
            success:false,
            message:"User ID is required"});
    }
    const futsalId = req.futsalId;
    if(!futsalId) {
        return res.status(400).json({
            success:false,
            message:"Futsal ID is required"});
    }

    try {
        const newForum = await Forum.create({
            title,
            content,
            slug,
            category,
            user_id: userId,
            futsal_id: futsalId
        });

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
        const forums = await Forum.findAll();
        if(forums.length === 0){
            return res.status(404).json({
                success:false,
                message:"No forums found"});
        }
        res.status(200).json({
            success: true,
            message: "Forums fetched successfully",
            data: forums
        });
    } catch (error) {
        console.error("Error fetching forums:", error);
        res.status(500).json({ error: "Failed to fetch forums" });
    }
}

//get forum by userId

const getForumsByUserId = async (req,res)=>{
    const userId = req.userId;  
    if(!userId){
        return res.status(400).json({
            success:false,
            message:"User ID is required"});
    }
    try {
        const forums = await Forum.findAll({where:{user_id:userId}});
        if(forums.length === 0){
            return res.status(404).json({
                success:false,
                message:"No forums found for this user"});
        }
        res.status(200).json({  
            success:true,
            message:"Forums fetched successfully",
            data:forums
        });
    } catch (error) {
        console.error("Error fetching forums by user ID:", error);
        res.status(500).json({ error: "Failed to fetch forums" });
    }       
}

//get forum by futsalId 
const getForumsByFutsalId = async (req,res)=>{
    const futsalId = req.futsalId;
    if(!futsalId){
        return res.status(400).json({
            success:false,
            message:"Futsal ID is required"});
    }
    try {
        const forums = await Forum.findAll({where:{futsal_id:futsalId}});
        if(forums.length === 0){
            return res.status(404).json({
                success:false,
                message:"No forums found for this futsal"});
        }
        res.status(200).json({  
            success:true,
            message:"Forums fetched successfully",
            data:forums
        });
    } catch (error) {
        console.error("Error fetching forums by futsal ID:", error);
        res.status(500).json({ error: "Failed to fetch forums" });
    }
}


//get forum by category
const getForumsByCategory = async (req,res)=>{
    const category = req.query.category;
    if(!category){
        return res.status(400).json({
            success:false,
            message:"Category is required"});
    }
    try {
        const forums = await Forum.findAll({where:{category}});
        if(forums.length === 0){
            return res.status(404).json({
                success:false,
                message:"No forums found for this category"});
        }
        res.status(200).json({  
            success:true,
            message:"Forums fetched successfully",
            data:forums
        });
    } catch (error) {
        console.error("Error fetching forums by category:", error);
        res.status(500).json({ error: "Failed to fetch forums" });
    }   
}

//get forum by id
const getForumById = async (req,res)=>{
    const forumId = req.params.id;
    if(!forumId){
        return res.status(400).json({
            success:false,
            message:"Forum ID is required"});
    }
    try {
        const forum = await Forum.findByPk(forumId);
        if(!forum){
            return res.status(404).json({
                success:false,
                message:"Forum not found"});
        }       
        res.status(200).json({  
            success:true,
            message:"Forum fetched successfully",
            data:forum
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
        if(!forum){
            return res.status(404).json({
                success:false,
                message:"Forum not found"});
        }       
        res.status(200).json({  
            success:true,
            message:"Forum fetched successfully",
            data:forum
        });
    } catch (error) {   
        console.error("Error fetching forum by slug:", error);
        res.status(500).json({ error: "Failed to fetch forum" });
    }
}

module.exports = {
    createForum,
    getAllForums,
    getForumsByUserId,  
    getForumsByFutsalId,
    getForumsByCategory,
    getForumById,
    getForumBySlug
}

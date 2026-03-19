//create 
const { Forum } = require('../../models');

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
    const userId = req?.userId;
    if(!userId){
        return res.status(400).json({
            success:false,
            message:"User ID is required"});
    }
    try {
        const forums = await Forum.findAll({where:{user_id:userId}});
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
    const futsalId = req?.futsalId;
    if(!futsalId){
        return res.status(400).json({
            success:false,
            message:"Futsal ID is required"});
    }
    try {
        const forums = await Forum.findAll({where:{futsal_id:futsalId}});
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

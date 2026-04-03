const { Footsal, Subscription } = require("../../models");

const getAllFutsal = async (req,res)=>{
    const futsals = await Footsal.findAll();
    if(!futsals[0]){
        return res.status(400).json({
            success:false,
            message:"No futsal found"
        })
    }
    res.status(200).json({
        success:true,
        message:"Futsal fetch successfully",
        data:futsals
    })
}

const getFutsalById = async( req,res)=>{
    const {id} = req.params;
    const futsal = await Footsal.findByPk(id);
    if(!futsal){
        return res.status(400).json({
            success:false,
            message:"No futsal found with this id"
        })
    }
    res.status(200).json({
        success:true,
        message:"Futsal fetch successfully",
        data:futsal
    })
}

// this is without login functions
const getFutsalbySubsciption_true = async (req,res)=>{
    const futsals = await Footsal.findAll();
    if(!futsals[0]){
        return res.status(400).json({
            success:false,
            message:"No futsal found"
        })
    }
    const futsalIds = futsals.map(futsal=> futsal.id);
    const futsalSubscription = await Subscription.findAll({
        where:{
            footsal_id:futsalIds,
            status:"active"
        },
        include:[
            {
                model:Footsal,
                as:"footsal",
                attributes:["id","futsalCode","futsalName","email","phoneNumber","ownerName"]
            }
        ]
}
    );
    if(!futsalSubscription[0]){
        return res.status(400).json({
            success:false,
            message:"No active subscription found"
        })
    }
    res.status(200).json({
        success:true,
        message:"Futsal with active subscription fetch successfully",
        data:futsalSubscription
    })
}

const getFutsalProfile = async (req,res)=>{
    const futsalId = req.futsalId;
    const futsal = await Footsal.findByPk(futsalId);
    if(!futsal){
        return res.status(400).json({
            success:false,
            message:"No futsal found with this id"
        })
    }
    res.status(200).json({
        success:true,
        message:"Futsal profile fetch successfully",
        data:futsal
    })
}

const updateFutsalProfile = async (req, res) => {
    const futsalId = req.futsalId;
    const { ownerName, email, phoneNumber } = req.body;
    
    const futsal = await Footsal.findByPk(futsalId);
    if(!futsal){
        return res.status(400).json({
            success:false,
            message:"No futsal found with this id"
        })
    }

    try {
        if(ownerName) futsal.ownerName = ownerName;
        if(email) futsal.email = email;
        if(phoneNumber) futsal.phoneNumber = phoneNumber;

        await futsal.save();

        res.status(200).json({
            success:true,
            message:"Futsal profile updated successfully",
            data:futsal
        })
    } catch(err) {
        return res.status(500).json({
            success:false,
            message:"Error updating futsal profile",
            error: err.message
        })
    }
}


module.exports = {
    getAllFutsal,
    getFutsalById,
    getFutsalbySubsciption_true,
    getFutsalProfile,
    updateFutsalProfile
}
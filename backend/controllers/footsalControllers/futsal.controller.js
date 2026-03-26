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


module.exports = {
    getAllFutsal,
    getFutsalById,
    getFutsalbySubsciption_true,
}
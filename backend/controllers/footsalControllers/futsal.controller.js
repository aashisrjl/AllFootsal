const { Footsal, Subscription, sequelize } = require("../../models");
const { QueryTypes } = require("sequelize");

const normalizeTenantCode = (code) => {
    const value = String(code || "").trim();
    return /^\d+$/.test(value) ? value : null;
};

const getProfileCompletionStatus = async (futsalCode) => {
    const code = normalizeTenantCode(futsalCode);
    if (!code) {
        return {
            isLocationComplete: false,
            isInfoComplete: false,
            isProfileComplete: false,
            missingSections: ["location", "info"]
        };
    }

    const [locationRows, infoRows] = await Promise.all([
        sequelize.query(
            `SELECT id, district, address, city, latitude, longitude
             FROM location_${code}
             ORDER BY id DESC
             LIMIT 1`,
            { type: QueryTypes.SELECT }
        ).catch(() => []),
        sequelize.query(
            `SELECT id, established_year, facilities, operating_hours, social_links, website_url
             FROM info_${code}
             ORDER BY id DESC
             LIMIT 1`,
            { type: QueryTypes.SELECT }
        ).catch(() => []),
    ]);

    const location = locationRows[0];
    const info = infoRows[0];

    const isLocationComplete = Boolean(
        location &&
        location.district &&
        location.address &&
        location.city &&
        location.latitude !== null &&
        location.longitude !== null
    );

    const isInfoComplete = Boolean(
        info &&
        info.established_year &&
        info.facilities &&
        info.operating_hours &&
        info.social_links &&
        info.website_url
    );

    const missingSections = [];
    if (!isLocationComplete) missingSections.push("location");
    if (!isInfoComplete) missingSections.push("info");

    return {
        isLocationComplete,
        isInfoComplete,
        isProfileComplete: isLocationComplete && isInfoComplete,
        missingSections
    };
};

const getAllFutsal = async (req,res)=>{
    const now = new Date();
    const futsals = await Footsal.findAll({
        include: [{
            model: Subscription,
            as: 'subscription',
            required: true,
            where: {
                status: 'active',
                subscription_end: {
                    [require('sequelize').Op.gt]: now,
                },
            },
        }],
    });
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
    const now = new Date();
    const futsalSubscription = await Subscription.findAll({
        where:{
            status:"active",
            subscription_end: {
                [require('sequelize').Op.gt]: now,
            },
        },
        include:[
            {
                model:Footsal,
                as:"footsal",
                attributes:["id","futsalCode","futsalName","email","phoneNumber","ownerName"]
            }
        ]
    });
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
    const completion = await getProfileCompletionStatus(futsal.futsalCode);

    res.status(200).json({
        success:true,
        message:"Futsal profile fetch successfully",
        data: {
            ...futsal.toJSON(),
            profileCompletion: completion,
        }
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
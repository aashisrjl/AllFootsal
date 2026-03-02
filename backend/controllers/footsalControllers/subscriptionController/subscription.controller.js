const { Subscription } = require("../../../models")


const getFutsalSubscription = async (req,res)=>{
    const futsalId = req.futsalId

    const futsal_subs = await Subscription.findOne({
        where:{
            futsal_id:futsalId
        }
    })

    if(!futsal_subs){
        res.status(400).json({
            message: "can't find any subscription for this futsal"
        })
    }

    res.status(200).json({
        message: `Subscription fetch for futsal ${req.futsal.futsalName} `
    })
}

const addFutsalSubscription = async (req,res)=>{
  
    const futsalId = req.futsalId
    const existed = await Subscription.findAll({
        where:{
            futsal_id: futsalId
        }
    })

    if(existed){
        return res.status(400).json({
            message: "you already created a subscription"
        })
    }

}

const addTrialSubscription = async (req, res) => {
 
    const futsalId = req.futsalId;

    const existing = await Subscription.findOne({ where: { footsal_id: futsalId } });

    if (existing?.is_trial) {
      return res.status(409).json({ message: "Trial already used." });
    }

    if (existing?.status === "active") {
      return res.status(409).json({ message: "Active subscription exists." });
    }

    const now = new Date();
    const trialEnd = new Date(now);
    trialEnd.setDate(trialEnd.getDate() + 14); // 14-day trial

    await Subscription.create({
      footsal_id: futsalId,
      subscription_plan: "trial",
      subscription_start: now,
      subscription_end: trialEnd,
      subscription_fee: 0.00,
      status: "active",
      is_trial: true,
    });

    return res.status(201).json({ message: "Trial subscription activated." });

};
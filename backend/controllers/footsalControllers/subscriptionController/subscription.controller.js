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
  const {subscription_plan} = req.params
    const futsalId = req.futsalId
    const existed = await Subscription.findOne({
        where:{
            futsal_id: futsalId
        }
    })
    const Datenow = new Date();
    const DateEnd = new Date(now);
    const subscription_price=0.0;
    if(subscription_plan == "trial"){
        if (existed?.is_trial) {
      return res.status(409).json({
         message: "Trial already used." 
        });
    }
        DateEnd.setDate(DateEnd.getDate() + 14); //trial
        subscription_price = 0.0;
    }else if(subscription_plan == "monthly"){
         DateEnd.setDate(DateEnd.getDate() + 30); // monthly=15
         subscription_price= 1200.00;
    }else if(subscription_plan == "half-yearly"){
        DateEnd.setDate(DateEnd.getDate() + 180); // half-yearly
        subscription_price = 6000.00;
    }else if(subscription_plan == "yearly"){
        DateEnd.setDate(DateEnd.getDate() + 360); // yearaly
        subscription_price= 10000.00;
    }else{
        res.status(400).json({
            message: "select the correct plan"
        })
    }

    const subs = await Subscription.Create({
        subscription_plan,
        subscription_start:Datenow,
        subscription_end:DateEnd,
        subscription_fee : subscription_price,
        status: "active"
    })

    res.status(200).json({
        message: "subscription created sucessfully"
    })
   
    if(existed){
        Subscription.subscription_plan = subscription_plan;
        Subscription.subscription_start= Datenow;
        Subscription.subscription_end= DateEnd;
        Subscription.subscription_fee= subscription_price;
        Subscription.status = "active";
        await Subscription.save();

        res.status(400).json({
            message: "Successfully updated a subscription"
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
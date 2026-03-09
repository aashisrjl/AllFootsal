const { Subscription } = require("../../../models");

const getFutsalSubscription = async (req, res) => {
    try {
        const futsalId = req.futsalId;

        const futsal_subs = await Subscription.findOne({
            where: {
                footsal_id: futsalId
            }
        });

        if (!futsal_subs) {
            return res.status(404).json({
                success: false,
                message: "Can't find any subscription for this futsal"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Subscription fetched successfully",
            data: futsal_subs
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

const addFutsalSubscription = async (req, res) => {
    try {
        const { subscription_plan } = req.body; // Used body explicitly as it's better for updates. Also handles URL params if needed. (assuming route config)
        const futsalId = req.futsalId;
        const plan = subscription_plan || req.params.subscription_plan; // fallback if passed in params
        
        if (!plan) {
            return res.status(400).json({
                success: false,
                message: "Subscription plan is required"
            });
        }

        const existed = await Subscription.findOne({
            where: {
                footsal_id: futsalId
            }
        });

        const DateNow = new Date();
        let DateEnd = new Date(DateNow);
        let subscription_price = 0.0;

        if (plan === "trial") {
            if (existed?.is_trial) {
                return res.status(409).json({
                    success: false,
                    message: "Trial already used."
                });
            }
            DateEnd.setDate(DateEnd.getDate() + 14); // trial
            subscription_price = 0.0;
        } else if (plan === "monthly") {
            DateEnd.setDate(DateEnd.getDate() + 30); // monthly=30
            subscription_price = 1200.00;
        } else if (plan === "half-yearly") {
            DateEnd.setDate(DateEnd.getDate() + 180); // half-yearly
            subscription_price = 6000.00;
        } else if (plan === "yearly") {
            DateEnd.setDate(DateEnd.getDate() + 360); // yearly
            subscription_price = 10000.00;
        } else {
            return res.status(400).json({
                success: false,
                message: "Select the correct plan (trial, monthly, half-yearly, yearly)"
            });
        }

        if (existed) {
            existed.subscription_plan = plan;
            existed.subscription_start = DateNow;
            existed.subscription_end = DateEnd;
            existed.subscription_fee = subscription_price;
            existed.status = "pending"; // Normally pending until payment is made
            if (plan === "trial") {
                existed.is_trial = true;
                existed.status = "active";
            }
            await existed.save();

            return res.status(200).json({
                success: true,
                message: "Successfully updated subscription",
                data: existed
            });
        } else {
            const subs = await Subscription.create({
                footsal_id: futsalId,
                subscription_plan: plan,
                subscription_start: DateNow,
                subscription_end: DateEnd,
                subscription_fee: subscription_price,
                status: plan === "trial" ? "active" : "pending",
                is_trial: plan === "trial"
            });

            return res.status(201).json({
                success: true,
                message: "Subscription created successfully",
                data: subs
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

const addTrialSubscription = async (req, res) => {
    try {
        const futsalId = req.futsalId;

        const existing = await Subscription.findOne({ where: { footsal_id: futsalId } });

        if (existing?.is_trial) {
            return res.status(409).json({ success: false, message: "Trial already used." });
        }

        if (existing?.status === "active") {
            return res.status(409).json({ success: false, message: "Active subscription exists." });
        }

        const now = new Date();
        const trialEnd = new Date(now);
        trialEnd.setDate(trialEnd.getDate() + 14); // 14-day trial

        let sub;
        if (existing) {
            existing.subscription_plan = "trial";
            existing.subscription_start = now;
            existing.subscription_end = trialEnd;
            existing.subscription_fee = 0.00;
            existing.status = "active";
            existing.is_trial = true;
            await existing.save();
            sub = existing;
        } else {
            sub = await Subscription.create({
                footsal_id: futsalId,
                subscription_plan: "trial",
                subscription_start: now,
                subscription_end: trialEnd,
                subscription_fee: 0.00,
                status: "active",
                is_trial: true,
            });
        }

        return res.status(201).json({ success: true, message: "Trial subscription activated.", data: sub });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

module.exports = {
    getFutsalSubscription,
    addFutsalSubscription,
    addTrialSubscription
};
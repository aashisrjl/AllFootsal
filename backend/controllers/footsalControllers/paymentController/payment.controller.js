
const {sequelize, QueryTypes} = require("sequelize");
const { createEsewaPayment } = require("../../../services/esewa/esewa.service");
const { initiateKhaltiPayment, verifyKhaltiPayment } = require("../../../services/khalti/khalti.service");

//by futsal 
const getPayments = async (req,res)=>{
    const futsalCode = req.futsalCode;
    const payments = await sequelize.query(
        `SELECT * FROM payments_${futsalCode}`,
        {
            type: QueryTypes.SELECT,
        }
    );
    if(!payments[0]){
        return res.status(400).json({
            success:false,
            message:"No payments found for this futsal"
        })
    }
    res.status(200).json({
        success:true,
        message:"Payments fetch successfully",
        data:payments
    });
}

//by futsal and user information also by user_id
const getPaymentById = async (req,res)=>{
    const futsalCode = req.futsalCode;
    const paymentId = req.params.paymentId;
    const payment = await sequelize.query(
        `SELECT * FROM payments_${futsalCode} WHERE id = ?`,
        {
            replacements: [paymentId],
            type: QueryTypes.SELECT,
        }
    );
    const users = await sequelize.query(
        `SELECT u.id, u.username, u.email, u.phoneNumber FROM users u
         JOIN payments_${futsalCode} p ON u.id = p.user_id
         WHERE p.id = ?`,
        {
            replacements: [paymentId],
            type: QueryTypes.SELECT,
        }
    );
    if(users[0]){
        payment[0].user = users[0];
    }

    if(!payment[0]){
        return res.status(400).json({
            success:false,
            message:"No payment found with this id for this futsal"
        })
    }
    res.status(200).json({
        success:true,
        message:"Payment fetch successfully",
        data:payment[0]
    });
}

//by user
const getUserPayments = async (req,res)=>{
    const userId = req.userId;
    const {code} = req.tanent;
    const payments = await sequelize.query(
        `SELECT * FROM payments_${code} WHERE user_id = ?`,
        {
            replacements: [userId],
            type: QueryTypes.SELECT,
        }
    );
    res.status(200).json({
        success:true,
        message:"User payments fetch successfully",
        data:payments
    });
}

const createPayment = async (req,res)=>{
    const userId=req.userId;
    const {code} = req.tanent;
    const {booking_id, gateway, provider_order_id, provider_txn_id} = req.body;

    if(!booking_id || !gateway) {
        return res.status(400).json({
            success:false,
            message:"booking_id and gateway are required"
        })
    }
    if(!["cash","khalti","esewa","bank_transfer"].includes(gateway)){
        return res.status(400).json({
            success:false,
            message:"Invalid payment gateway"
        })
    }

    if((gateway === "khalti" || gateway === "esewa") && (!provider_order_id || !provider_txn_id)){
        return res.status(400).json({
            success:false,
            message:"provider_order_id and provider_txn_id are required for khalti and esewa payments"
        })
    }

    if(gateway === "cash" && (provider_order_id || provider_txn_id)){
        return res.status(400).json({
            success:false,
            message:"provider_order_id and provider_txn_id should not be provided for cash payments"
        })
    }
    
     if(gateway === "bank_transfer" && (!provider_order_id || provider_txn_id)){
        return res.status(400).json({
            success:false,
            message:"provider_order_id is required and provider_txn_id should not be provided for bank transfer payments"
        })
    }

    if(gateway === "esewa"){
        const esewaResponse = await createEsewaPayment({amount, provider_order_id, provider_txn_id});
        if(!esewaResponse.success){
            return res.status(400).json({
                success:false,
                message:"Esewa payment failed",
                error: esewaResponse.error
            })
        }

    }
        if(gateway === "khalti"){
        const khaltiResponse = await initiateKhaltiPayment({amount, provider_order_id, provider_txn_id});
        if(!khaltiResponse.success){
            return res.status(400).json({
                success:false,
                message:"Khalti payment failed",
                error: khaltiResponse.error
            })
        }

    }

    const existingPayment = await sequelize.query(
        `SELECT * FROM payments_${code} WHERE provider_txn_id = ? AND gateway = ?`,
        {
            replacements: [provider_txn_id, gateway],
            type: QueryTypes.SELECT,
        }
    );

    if(existingPayment[0]){
        return res.status(400).json({
            success:false,
            message:"Payment with this provider_txn_id and gateway already exists"
        })
    }

    const transaction_uuid = crypto.randomUUID();
    const amount = req.body.amount || 0;
    const remarks = req.body.remarks || null;

    const payment = await Payment.create({
      footsal_id: req.futsalId,
      subscription_id: null, // You can link this to a subscription if needed
      amount,
      payment_method: gateway,
      payment_status: "pending",
      transaction_id: transaction_uuid,
      remarks,
    });

    res.status(201).json({
        success:true,
        message:"Payment created successfully",
        data:payment
    });
}

const verifyPayment = async (req,res)=>{
    try {
        const {code} = req.tanent;
        const paymentId = req.params.paymentId;
        const payment = await sequelize.query(
            `SELECT * FROM payments_${code} WHERE id = ?`,
            {
                replacements: [paymentId],
                type: QueryTypes.SELECT,
            }
        );
        if(!payment[0]){
            return res.status(400).json({
                success:false,
                message:"No payment found with this id for this futsal"
            })
        }
        if(payment[0].payment_status === "paid"){
            return res.status(400).json({
                success:false,
                message:"Payment is already verified"
            })
        }

        if(payment[0].payment_method === "khalti"){
            const khaltiResponse = await verifyKhaltiPayment({amount: payment[0].amount, provider_order_id: payment[0].provider_order_id, provider_txn_id: payment[0].provider_txn_id});
            if(!khaltiResponse.success){
                return res.status(400).json({
                    success:false,
                    message:"Khalti payment verification failed",
                    error: khaltiResponse.error
                })
            }
             await sequelize.query(
            `UPDATE payments_${code} SET status = 'paid' WHERE id = ?`,
            {
                replacements: [paymentId],
                type: QueryTypes.UPDATE,
            }
        );

        res.status(200).json({
            success:true,
            message:"Khalti Payment verified successfully"
        });
        }
    if(payment[0].payment_method === "esewa"){
        const esewaResponse = await createEsewaPayment({amount: payment[0].amount, provider_order_id: payment[0].provider_order_id, provider_txn_id: payment[0].provider_txn_id});
        if(!esewaResponse.success){
            return res.status(400).json({
                success:false,
                message:"Esewa payment verification failed",
                error: esewaResponse.error
            })
        }
         await sequelize.query(
            `UPDATE payments_${code} SET status = 'paid' WHERE id = ?`,
            {
                replacements: [paymentId],
                type: QueryTypes.UPDATE,
            }
        );

        res.status(200).json({
            success:true,
            message:"eSewa Payment verified successfully"
        });
    }

     await sequelize.query(
            `UPDATE payments_${code} SET status = 'paid' WHERE id = ?`,
            {
                replacements: [paymentId],
                type: QueryTypes.UPDATE,
            }
        );

        res.status(200).json({
            success:true,
            message:"Payment verified successfully"
        });
}catch(err){
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
}
}



module.exports = {
    getPayments,
    getPaymentById,
    getUserPayments,
    createPayment,
    verifyPayment
}

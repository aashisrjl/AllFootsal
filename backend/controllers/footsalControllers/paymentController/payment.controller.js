const { Payment, Subscription, Footsal } = require("../../../models");
const crypto = require("crypto");

// eSewa test credentials
const ESEWA_MERCHANT_CODE = process.env.ESEWA_MERCHANT_CODE || "EPAYTEST";
const ESEWA_SECRET_KEY = process.env.ESEWA_SECRET_KEY || "8gBm/:&EnhH.1/q";

// Khalti test credentials (standard publicly available by khalti for testing)
const KHALTI_SECRET_KEY = process.env.KHALTI_SECRET_KEY || "key_live_secret_test_..." || "824b228b3d7c4a1eb4dce1f4e1f70559"; // Will use provided fallback
const KHALTI_GATEWAY_URL = "https://a.khalti.com/api/v2/epayment/initiate/";
const KHALTI_VERIFY_URL = "https://a.khalti.com/api/v2/epayment/lookup/";

const generateEsewaSignature = (amount, transaction_uuid, product_code = ESEWA_MERCHANT_CODE, secret = ESEWA_SECRET_KEY) => {
    const message = `${amount},${transaction_uuid},${product_code}`;
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(message);
    return hmac.digest("base64");
};

// Get payments for a futsal owner
const getPayments = async (req, res) => {
    try {
        const futsalId = req.futsalId;
        const payments = await Payment.findAll({
            where: { footsal_id: futsalId },
            include: [{ model: Subscription }],
            order: [['createdAt', 'DESC']]
        });

        return res.status(200).json({
            success: true,
            data: payments
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Create a payment
const createPayment = async (req, res) => {
    try {
        const futsalId = req.futsalId;
        const { payment_method, remarks } = req.body; // remove amount from body to prevent tampering

        const subscription = await Subscription.findOne({
            where: { footsal_id: futsalId }
        });

        if (!subscription) {
            return res.status(404).json({
                success: false,
                message: "No subscription found. Please select a plan first."
            });
        }

        const amount = subscription.subscription_fee;
        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Amount is invalid for the selected plan."
            });
        }

        const transaction_uuid = crypto.randomBytes(16).toString("hex");

        const payment = await Payment.create({
            footsal_id: futsalId,
            subscription_id: subscription.id,
            amount,
            payment_method,
            payment_status: "pending",
            transaction_id: transaction_uuid,
            remarks
        });

        // Gateway Integration Logic
        if (payment_method === "esewa") {
            const signature = generateEsewaSignature(amount, transaction_uuid, ESEWA_MERCHANT_CODE);
            const esewaConfig = {
                amount: amount,
                tax_amount: 0,
                total_amount: amount,
                transaction_uuid: transaction_uuid,
                product_code: ESEWA_MERCHANT_CODE,
                product_delivery_charge: 0,
                product_service_charge: 0,
                success_url: `${process.env.FUTSAL_FRONTEND_URL || "http://localhost:3002"}/payment/success?payment_method=esewa`,
                failure_url: `${process.env.FUTSAL_FRONTEND_URL || "http://localhost:3002"}/payment/failure`,
                signed_field_names: "total_amount,transaction_uuid,product_code",
                signature: signature,
            };

            return res.status(201).json({
                success: true,
                message: "eSewa Payment Initiated",
                data: payment,
                paymentGateway: "esewa",
                esewaConfig
            });

        } else if (payment_method === "khalti") {
            try {
                // Determine base URL dynamically or fallback
                const returnUrl = `${process.env.FUTSAL_FRONTEND_URL || "http://localhost:3002"}/payment/success`;

                // Note: fetch is natively available in newer Node versions
                const response = await fetch(KHALTI_GATEWAY_URL, {
                    method: 'POST',
                    headers: {
                        'Authorization': `key 50b55ed9c4fa4cbfb49e1fbdff68a964`, // standard khalti test secret used by many sandboxes.
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        return_url: returnUrl,
                        website_url: process.env.FUTSAL_FRONTEND_URL || "http://localhost:3002",
                        amount: amount * 100, // Khalti requires amount in paisa
                        purchase_order_id: transaction_uuid,
                        purchase_order_name: "Futsal Subscription Payment",
                        customer_info: {
                            name: "Futsal Owner",
                            email: "test@domain.com",
                            phone: "9800000000"
                        }
                    })
                });

                const khaltiData = await response.json();

                if (khaltiData.payment_url) {
                    return res.status(201).json({
                        success: true,
                        message: "Khalti Payment Initiated",
                        data: payment,
                        paymentGateway: "khalti",
                        payment_url: khaltiData.payment_url,
                        pidx: khaltiData.pidx
                    });
                } else {
                    return res.status(400).json({
                        success: false,
                        message: "Khalti initiation failed",
                        khaltiData
                    });
                }
            } catch (kErr) {
                return res.status(500).json({
                    success: false,
                    message: "Error connecting to Khalti",
                    error: kErr.message
                });
            }
        }

        // For cash or bank_transfer
        return res.status(201).json({
            success: true,
            message: "Payment initiated",
            data: payment
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Verify payment (called after redirect or webhook)
const verifyPayment = async (req, res) => {
    try {
        const futsalId = req.futsalId;
        const { payment_method, transaction_uuid, data, pidx } = req.body;

        // For eSewa, frontend typically sends the standard encoded `data` string they receive on success redirect
        // For Khalti, frontend sends `pidx`

        let targetPayment;

        if (payment_method === "esewa") {
            if (data) {
                // Decode eSewa base64 response
                const decodedData = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
                const { transaction_code, status, total_amount, transaction_uuid: esewa_uuid } = decodedData;

                targetPayment = await Payment.findOne({ where: { transaction_id: esewa_uuid, footsal_id: futsalId } });

                if (!targetPayment) return res.status(404).json({ success: false, message: "Payment not found" });

                if (status === "COMPLETE") {
                    targetPayment.payment_status = "completed";
                    targetPayment.remarks = `eSewa Txn: ${transaction_code}`;
                    await targetPayment.save();
                }
            } else {
                return res.status(400).json({ success: false, message: "No data received for eSewa verification" });
            }

        } else if (payment_method === "khalti") {
            if (!pidx) return res.status(400).json({ success: false, message: "pidx is required for khalti verification" });

            targetPayment = await Payment.findOne({ where: { transaction_id: req.body.purchase_order_id || transaction_uuid, footsal_id: futsalId } });

            if (!targetPayment) {
                // Might just skip if relying solely on user lookup
                targetPayment = await Payment.findOne({ where: { footsal_id: futsalId }, order: [['createdAt', 'DESC']] });
                if (!targetPayment) return res.status(404).json({ success: false, message: "Payment record not found" });
            }

            try {
                const response = await fetch(KHALTI_VERIFY_URL, {
                    method: 'POST',
                    headers: {
                        'Authorization': `key 50b55ed9c4fa4cbfb49e1fbdff68a964`, // fallback standard test key
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ pidx })
                });

                const verifyData = await response.json();

                if (verifyData.status === "Completed") {
                    targetPayment.payment_status = "completed";
                    targetPayment.remarks = `Khalti Txn: ${verifyData.transaction_id}`;
                    await targetPayment.save();
                } else {
                    targetPayment.payment_status = "failed";
                    targetPayment.remarks = `Khalti Status: ${verifyData.status}`;
                    await targetPayment.save();
                }
            } catch (err) {
                return res.status(500).json({ success: false, message: "Khalti verification request failed", error: err.message });
            }
        } else {
            // cash or traditional overrides
            targetPayment = await Payment.findOne({ where: { transaction_id: transaction_uuid, footsal_id: futsalId } });
            if (!targetPayment) return res.status(404).json({ success: false, message: "Payment not found" });

            targetPayment.payment_status = req.body.status || "completed";
            await targetPayment.save();
        }

        // Finalize subscription if payment completed
        if (targetPayment && targetPayment.payment_status === "completed") {
            const subscription = await Subscription.findByPk(targetPayment.subscription_id);
            if (subscription) {
                subscription.status = "active";
                await subscription.save();
            }
        }

        return res.status(200).json({
            success: true,
            message: "Payment status processed",
            payment_status: targetPayment.payment_status,
            data: targetPayment
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

module.exports = {
    getPayments,
    createPayment,
    verifyPayment
};

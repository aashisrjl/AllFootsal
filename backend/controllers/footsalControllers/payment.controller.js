const { Payment, Subscription } = require("../../models");
const crypto = require("crypto");

const { createEsewaPayment } = require("../../services/esewa/esewa.service");
const {
  initiateKhaltiPayment,
  verifyKhaltiPayment,
} = require("../../services/khalti/khalti.service");


// ===============================
// Get Payments
// ===============================
const getPayments = async (req, res) => {
  try {
    const futsalId = req.futsalId;

    const payments = await Payment.findAll({
      where: { footsal_id: futsalId },
      include: [{ model: Subscription }],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      data: payments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


// ===============================
// Create Payment
// ===============================
const createPayment = async (req, res) => {
  try {
    const futsalId = req.futsalId;
    const { payment_method, remarks } = req.body;

    const allowedMethods = ["esewa", "khalti", "cash", "bank_transfer"];

    if (!allowedMethods.includes(payment_method)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method",
      });
    }

    const subscription = await Subscription.findOne({
      where: { footsal_id: futsalId },
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "No subscription found. Please select a plan first.",
      });
    }

    const amount = subscription.subscription_fee;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid subscription amount",
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
      remarks,
    });

    // ===============================
    // eSewa Payment
    // ===============================
    if (payment_method === "esewa") {
      const esewaConfig = createEsewaPayment(amount, transaction_uuid);

      return res.status(201).json({
        success: true,
        message: "eSewa payment initiated",
        paymentGateway: "esewa",
        data: payment,
        esewaConfig,
      });
    }

    // ===============================
    // Khalti Payment
    // ===============================
    if (payment_method === "khalti") {
      const khaltiData = await initiateKhaltiPayment(
        amount,
        transaction_uuid
      );

      if (!khaltiData.payment_url) {
        return res.status(400).json({
          success: false,
          message: "Khalti initiation failed",
          khaltiData,
        });
      }

      return res.status(201).json({
        success: true,
        message: "Khalti payment initiated",
        paymentGateway: "khalti",
        data: payment,
        payment_url: khaltiData.payment_url,
        pidx: khaltiData.pidx,
      });
    }

    // ===============================
    // Cash / Bank Transfer
    // ===============================
    return res.status(201).json({
      success: true,
      message: "Payment created successfully",
      data: payment,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


// ===============================
// Verify Payment
// ===============================
const verifyPayment = async (req, res) => {
  try {
    const futsalId = req.futsalId;
    const { payment_method, transaction_uuid, data, pidx, status } = req.body;

    let targetPayment;

    // ===============================
    // Verify eSewa
    // ===============================
    if (payment_method === "esewa") {
      if (!data) {
        return res.status(400).json({
          success: false,
          message: "No eSewa data received",
        });
      }

      const decoded = JSON.parse(
        Buffer.from(data, "base64").toString("utf-8")
      );

      const {
        status: esewaStatus,
        transaction_code,
        transaction_uuid: esewa_uuid,
      } = decoded;

      targetPayment = await Payment.findOne({
        where: {
          transaction_id: esewa_uuid,
          footsal_id: futsalId,
        },
      });

      if (!targetPayment) {
        return res.status(404).json({
          success: false,
          message: "Payment not found",
        });
      }

      if (esewaStatus === "COMPLETE") {
        targetPayment.payment_status = "completed";
        targetPayment.remarks = `eSewa Txn: ${transaction_code}`;
      } else {
        targetPayment.payment_status = "failed";
      }

      await targetPayment.save();
    }

    // ===============================
    // Verify Khalti
    // ===============================
    else if (payment_method === "khalti") {
      if (!pidx) {
        return res.status(400).json({
          success: false,
          message: "pidx required for Khalti verification",
        });
      }

      const verifyData = await verifyKhaltiPayment(pidx);

      targetPayment = await Payment.findOne({
        where: {
          transaction_id: transaction_uuid,
          footsal_id: futsalId,
        },
      });

      if (!targetPayment) {
        return res.status(404).json({
          success: false,
          message: "Payment record not found",
        });
      }

      if (verifyData.status === "Completed") {
        targetPayment.payment_status = "completed";
        targetPayment.remarks = `Khalti Txn: ${verifyData.transaction_id}`;
      } else {
        targetPayment.payment_status = "failed";
        targetPayment.remarks = `Khalti Status: ${verifyData.status}`;
      }

      await targetPayment.save();
    }

    // ===============================
    // Cash / Manual Payment
    // ===============================
    else {
      targetPayment = await Payment.findOne({
        where: {
          transaction_id: transaction_uuid,
          footsal_id: futsalId,
        },
      });

      if (!targetPayment) {
        return res.status(404).json({
          success: false,
          message: "Payment not found",
        });
      }

      targetPayment.payment_status = status || "completed";
      await targetPayment.save();
    }

    // ===============================
    // Activate Subscription
    // ===============================
    if (targetPayment.payment_status === "completed") {
      const subscription = await Subscription.findByPk(
        targetPayment.subscription_id
      );

      if (subscription) {
        subscription.status = "active";
        await subscription.save();
      }
    }

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      payment_status: targetPayment.payment_status,
      data: targetPayment,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


module.exports = {
  getPayments,
  createPayment,
  verifyPayment,
};
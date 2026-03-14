const crypto = require("crypto");

const DEFAULT_ESEWA_MERCHANT_CODE = process.env.ESEWA_MERCHANT_CODE || "EPAYTEST";
const DEFAULT_ESEWA_SECRET_KEY = process.env.ESEWA_SECRET_KEY || "8gBm/:&EnhH.1/q";

const generateEsewaSignature = ({
  amount,
  transactionUuid,
  merchantCode,
  secretKey
}) => {
  const message = `${amount},${transactionUuid},${merchantCode}`;
  const hmac = crypto.createHmac("sha256", secretKey);
  hmac.update(message);
  return hmac.digest("base64");
};

const createEsewaPayment_user_futsal = ({
  amount,
  transactionUuid,
  merchantCode = DEFAULT_ESEWA_MERCHANT_CODE,
  secretKey = DEFAULT_ESEWA_SECRET_KEY,
  successUrl,
  failureUrl
}) => {
  if (!amount || Number(amount) <= 0) {
    throw new Error("Valid amount is required for eSewa payment");
  }

  if (!transactionUuid) {
    throw new Error("transactionUuid is required for eSewa payment");
  }

  if (!merchantCode || !secretKey) {
    throw new Error("merchantCode and secretKey are required for eSewa payment");
  }

  const signature = generateEsewaSignature({
    amount,
    transactionUuid,
    merchantCode,
    secretKey
  });

  return {
    amount: amount,
    tax_amount: 0,
    total_amount: amount,
    transaction_uuid: transactionUuid,
    product_code: merchantCode,
    product_delivery_charge: 0,
    product_service_charge: 0,
    success_url:
      successUrl ||
      `${process.env.USER_FRONTEND_URL || "http://localhost:3001"}/payment/success?payment_method=esewa`,
    failure_url:
      failureUrl ||
      `${process.env.USER_FRONTEND_URL || "http://localhost:3001"}/payment/failure`,
    signed_field_names: "total_amount,transaction_uuid,product_code",
    signature
  };
};

module.exports = {
  createEsewaPayment_user_futsal
};
const crypto = require("crypto");

const ESEWA_MERCHANT_CODE = process.env.ESEWA_MERCHANT_CODE || "EPAYTEST";
const ESEWA_SECRET_KEY = process.env.ESEWA_SECRET_KEY || "8gBm/:&EnhH.1/q";

const generateEsewaSignature = (
  amount,
  transaction_uuid,
  product_code = ESEWA_MERCHANT_CODE
) => {
  const message = `${amount},${transaction_uuid},${product_code}`;
  const hmac = crypto.createHmac("sha256", ESEWA_SECRET_KEY);
  hmac.update(message);
  return hmac.digest("base64");
};

const createEsewaPayment = (amount, transaction_uuid) => {
  const signature = generateEsewaSignature(amount, transaction_uuid);

  return {
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
};

module.exports = {
  createEsewaPayment,
};
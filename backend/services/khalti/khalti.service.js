const KHALTI_SECRET_KEY =process.env.KHALTI_SECRET_KEY

const KHALTI_GATEWAY_URL ="https://a.khalti.com/api/v2/epayment/initiate/";

const KHALTI_VERIFY_URL ="https://a.khalti.com/api/v2/epayment/lookup/";

const initiateKhaltiPayment = async (amount, transaction_uuid) => {
  const returnUrl =
    `${process.env.FUTSAL_FRONTEND_URL || "http://localhost:3002"}/payment/success`;

  const response = await fetch(KHALTI_GATEWAY_URL, {
    method: "POST",
    headers: {
      Authorization: `key ${KHALTI_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      return_url: returnUrl,
      website_url: process.env.FUTSAL_FRONTEND_URL || "http://localhost:3002",
      amount: amount * 100,
      purchase_order_id: transaction_uuid,
      purchase_order_name: "Futsal Subscription Payment",
      customer_info: {
        name: "Futsal Owner",
        email: "test@domain.com",
        phone: "9800000000",
      },
    }),
  });

  return await response.json();
};

const verifyKhaltiPayment = async (pidx) => {
  const response = await fetch(KHALTI_VERIFY_URL, {
    method: "POST",
    headers: {
      Authorization: `key ${KHALTI_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ pidx }),
  });

  return await response.json();
};

module.exports = {
  initiateKhaltiPayment,
  verifyKhaltiPayment,
};

const DEFAULT_KHALTI_SECRET_KEY = process.env.KHALTI_SECRET_KEY || "";
const KHALTI_GATEWAY_URL = "https://a.khalti.com/api/v2/epayment/initiate/";
const KHALTI_VERIFY_URL = "https://a.khalti.com/api/v2/epayment/lookup/";

const initiateKhaltiPayment = async ({
  amount,
  transactionUuid,
  user,
  secretKey = DEFAULT_KHALTI_SECRET_KEY,
  returnUrl,
  websiteUrl
}) => {
  if (!secretKey) {
    throw new Error("Khalti secret key is required");
  }

  const finalReturnUrl =
    returnUrl || `${process.env.USER_FRONTEND_URL || "http://localhost:3001"}/payment/success`;
  const finalWebsiteUrl = websiteUrl || process.env.USER_FRONTEND_URL || "http://localhost:3001";

  const response = await fetch(KHALTI_GATEWAY_URL, {
    method: "POST",
    headers: {
      Authorization: `key ${secretKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      return_url: finalReturnUrl,
      website_url: finalWebsiteUrl,
      amount: Number(amount) * 100,
      purchase_order_id: transactionUuid,
      purchase_order_name: "Futsal Booking Payment",
      customer_info: {
        name: user?.username || "User",
        email: user?.email || "",
        phone: user?.phoneNumber || ""
      }
    })
  });

  const data = await response.json();

  if (!response.ok) {
    return {
      success: false,
      statusCode: response.status,
      ...data
    };
  }

  return data;
};

const verifyKhaltiPayment = async ({ pidx, secretKey = DEFAULT_KHALTI_SECRET_KEY }) => {
  if (!secretKey) {
    throw new Error("Khalti secret key is required");
  }

  const response = await fetch(KHALTI_VERIFY_URL, {
    method: "POST",
    headers: {
      Authorization: `key ${secretKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ pidx })
  });

  const data = await response.json();

  if (!response.ok) {
    return {
      success: false,
      statusCode: response.status,
      ...data
    };
  }

  return data;
};

module.exports = {
  initiateKhaltiPayment,
  verifyKhaltiPayment,
};
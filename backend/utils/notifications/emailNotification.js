const sendEmail = require("../../services/mail/sendEmail");

const formatDetails = (details = []) => {
  return details
    .filter(([, value]) => value !== undefined && value !== null && String(value).trim() !== "")
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");
};

const sendNotificationEmail = async ({
  to,
  subject,
  intro,
  details = [],
  closing = "Regards,\nAllFootsal Team",
  html,
}) => {
  if (!to) {
    return false;
  }

  const detailText = formatDetails(details);
  const text = [intro, detailText, closing].filter(Boolean).join("\n\n");

  return sendEmail({
    option: {
      to,
      subject,
      text,
      html,
    },
  });
};

module.exports = {
  sendNotificationEmail,
};

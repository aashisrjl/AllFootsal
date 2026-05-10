const {sequelize, Footsal} = require('../../../models');
const {QueryTypes} = require('sequelize');
const crypto = require("crypto");


// track visitor by user id or ip address and user agent
const trackVisitor = async (req, res) => {
  const futsalId = req.params.futsalId;
  const futsal = await Footsal.findOne({ where: { id: futsalId } });
  if (!futsal) {
    return res.status(404).json({
      success: false,
      message: "Futsal not found"
    });
  }

  let code = futsal.futsalCode;
 
  const userId = req.userId || null;
  const ip = (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || req.socket.remoteAddress || "";
  const ipHash = ip ? crypto.createHash("sha256").update(ip).digest("hex") : null;
  const ua = req.get("user-agent") || null;

  try{
    // Ensure unique constraint exists for user_id to enable ON DUPLICATE KEY UPDATE for users
    // Multiple NULLs for guests won't conflict in MySQL UNIQUE index
    await sequelize.query(
      `ALTER TABLE visitor_${code} ADD UNIQUE INDEX IF NOT EXISTS uq_user (user_id)`,
      { type: QueryTypes.RAW }
    ).catch(() => {}); // Ignore error if already exists or not supported by version

  await sequelize.query(
    `INSERT INTO visitor_${code}
      (user_id, ip_hash, user_agent)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE
      ip_hash = IFNULL(VALUES(ip_hash), ip_hash),
      user_agent = IFNULL(VALUES(user_agent), user_agent),
      visit_count = visit_count + 1,
      last_seen_at = CURRENT_TIMESTAMP`,
        {
            replacements: [userId,ipHash, ua],
            type: QueryTypes.INSERT,
        }
  );
  }catch(err){
    console.error("Error tracking visitor:", err);
    return res.status(500).json({
        success:false,
        message:"Failed to track visitor"
    })
  }
  return res.status(200).json({
     success: true, 
     message: "Visitor tracked successfully" 
    });
}

const getVisitorsDetails = async (req,res) => {
    const futsalCode = req.futsalCode;
    const visitors = await sequelize.query(
        `SELECT 
            v.user_id,
            MAX(v.ip_hash) as ip_hash,
            MAX(v.user_agent) as user_agent,
            SUM(v.visit_count) as visit_count,
            MIN(v.first_seen_at) as first_seen_at,
            MAX(v.last_seen_at) as last_seen_at,
            u.username, 
            u.email, 
            u.phoneNumber 
         FROM visitor_${futsalCode} v 
         LEFT JOIN users u ON v.user_id = u.id 
         GROUP BY v.user_id, IF(v.user_id IS NULL, v.id, NULL)
         ORDER BY last_seen_at DESC`,
        {
            type: QueryTypes.SELECT,
        }
    );

    res.status(200).json({
        success: true,
        message: "Visitor details fetched successfully",
        data: visitors
    });
}

module.exports = {
    getVisitorsDetails,
    trackVisitor
}




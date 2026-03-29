const {sequelize, Footsal} = require('../../../models');
const {QueryTypes} = require('sequelize');
const crypto = require("crypto");


// track visitor by user id or ip address and user agent
const trackVisitor = async (req, res) => {
  const futsalId = req.params.futsalId;
  let code = req?.tanent?.code || req?.tenant?.code;

  // If code not set by middleware, resolve futsal by ID or code
  if (!code) {
    const futsal = await Footsal.findOne({
      where: { id: futsalId }
    });

    if (!futsal) {
      const futsalByCode = await Footsal.findOne({
        where: { futsalCode: futsalId }
      });

      if (!futsalByCode) {
        return res.status(404).json({
          success: false,
          message: "Futsal not found"
        });
      }

      code = futsalByCode.futsalCode;
    } else {
      code = futsal.futsalCode;
    }
  }

  const userId = req.userId || null;
  const ip = (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || req.socket.remoteAddress || "";
  const ipHash = ip ? crypto.createHash("sha256").update(ip).digest("hex") : null;
  const ua = req.get("user-agent") || null;

  try{
  await sequelize.query(
    `INSERT INTO visitor_${code}
      (user_id, ip_hash, user_agent)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE
      ip_hash = COALESCE(VALUES(ip_hash), ip_hash),
      user_agent = COALESCE(VALUES(user_agent), user_agent),
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
        `select v.*, u.username, u.email, u.phoneNumber from visitor_${futsalCode} v left join users u on v.user_id = u.id order by v.last_seen_at desc`,
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




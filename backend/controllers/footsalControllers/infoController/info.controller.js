const { sequelize } = require("../../../models");
const { QueryTypes } = require("sequelize");

const createInfo = async (req, res) => {
  const fursalCode = req.futsalCode;
  const {
    established_year,
    facilities,
    operating_hours,
    social_links,
    website_url,
    parking_info,
    additional_info,
  } = req.body;

  if (
    !established_year ||
    !facilities ||
    !operating_hours ||
    !social_links ||
    !website_url
  ) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
  }
  try {
    const futsalInfo = await sequelize.query(
      `INSERT INTO info_${fursalCode} (established_year, facilities, operating_hours, social_links, website_url, parking_info, additional_info) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      {
        replacements: [
          established_year,
          JSON.stringify(facilities),
          JSON.stringify(operating_hours),
          JSON.stringify(social_links),
          website_url,
          parking_info,
          additional_info,
        ],
        type: QueryTypes.INSERT,
      },
    );

    return res.status(201).json({
      success: true,
      message: "Futsal info created successfully",
      data: futsalInfo,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error creating futsal info",
      message: "error in creating futsal info: " + err.message,
    });
  }
};

  const getInfo = async (req, res) => {
    const code = req.futsalCode || req.tanent.code;
    const info = await sequelize.query(
      `SELECT * FROM info_${code} ORDER BY created_at DESC LIMIT 1`,
      {
        type: QueryTypes.SELECT,
      },
    );
    if (info.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Futsal info not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Futsal info retrieved successfully",
      data: info,
    });
  };

  //by admin
  const updateInfo = async (req,res)=>{
    const code = req.futsalCode;
    const infoId = req.params.infoId;
    const {
      established_year,
      facilities,
      operating_hours,
      social_links,
      website_url,
      parking_info,
      additional_info,
    } = req.body;
    
    try {
        const [updated] = await sequelize.query(
            `UPDATE info_${code} SET established_year = ?, facilities = ?, operating_hours = ?, social_links = ?, website_url = ?, parking_info = ?, additional_info = ? WHERE id = ?`,
            {
                replacements: [
                    established_year,
                    JSON.stringify(facilities),
                    JSON.stringify(operating_hours),
                    JSON.stringify(social_links),
                    website_url,
                    parking_info,
                    additional_info,
                    infoId
                ],
                type: QueryTypes.UPDATE,
            }
        );
        
        if (updated === 0) {
            return res.status(404).json({
                success: false,
                message: "Futsal info not found or no changes made",
            });
        }
        
        return res.status(200).json({
            success: true,
            message: "Futsal info updated successfully",
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error updating futsal info",
            error: err.message,
        });
    }
  }


module.exports = {
    createInfo,
    getInfo,
    updateInfo,
    
}


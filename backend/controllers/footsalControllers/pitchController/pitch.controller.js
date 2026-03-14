const { QueryTypes } = require("sequelize");
const { sequelize } = require("../../../models");

//by admin and user
const getPitches = async (req, res) => {
  const code = req.futsalCode || req.tanent?.code;
 // pitches with media
  const pitches = await sequelize.query(
    ` SELECT p.*, m.url as media_url FROM pitch_${code} p LEFT JOIN media_${code} m ON p.id = m.pitch_id AND m.type='pitch'`,
    {
      type: QueryTypes.SELECT,
    },
  );

  if (pitches.length === 0) {
    return res.status(200).json({
      success: false,
      message: "pitches not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "pitches fetch successfully",
    data: pitches,
  });
};

//admin and user
const getPitchById = async (req, res) => {
  const code = req.futsalCode || req.tanent?.code;
  const { id } = req.params;
//   const pitch = await sequelize.query(
//     ` SELECT * FROM pitch_${code} WHERE id = ${id}`,
//     {
//       type: QueryTypes.SELECT,
//     },
//   );
//   const pitchMedia = await sequelize.query(
//     ` select * from media_${code} where type='pitch' and pitch_id = ${id}`,
//     {
//       type: QueryTypes.SELECT,
//     },
//   );

    const pitch = await sequelize.query(
    ` SELECT p.*, m.url as media_url FROM pitch_${code} p LEFT JOIN media_${code} m ON p.id = m.pitch_id AND m.type='pitch' WHERE p.id = ${id}`,
    {
      type: QueryTypes.SELECT,
    },
  );

  if (!pitch) {
    return res.status(404).json({
      success: false,
      message: "pitch not found",
    });
  }
  res.status(200).json({
    success: true,
    message: "pitch fetch successfully",
    data: pitch,
  });
};

// admin
const createPitch = async (req, res) => {
  const futsalCode = req.futsalCode;
  const {
    name,
    pitch_type,
    surface_type,
    dimensions,
    price_per_hour,
    lighting,
    indoor,
    is_active,
  } = req.body;
  if (!name || !pitch_type || !price_per_hour) {
    return res.status(400).json({
      success: false,
      message: "name, pitch_type and price_per_hour are required",
    });
  }

  const newPitch = await sequelize.query(
    `INSERT INTO pitch_${futsalCode} (name, pitch_type,surface_type,dimensions,price_per_hour,lighting,indoor,is_active) VALUES (?,?,?,?,?,?,?,?)`,
    {
      type: QueryTypes.INSERT,
      replacements: [
        name,
        pitch_type,
        surface_type,
        dimensions,
        price_per_hour,
        lighting,
        indoor,
        is_active,
      ],
    },
  );
  if (!newPitch) {
    return res.status(500).json({
      success: false,
      message: "failed to create pitch",
    });
  }
  res.status(201).json({
    success: true,
    message: "pitch created successfully",
    data: newPitch,
  });
};


//admin
const editPitch = async (req, res) => {
  const futsalCode = req.futsalCode;
  const { id } = req.params;
  const {
    name,
    pitch_type,
    surface_type,
    dimensions,
    price_per_hour,
    lighting,
    indoor,
    is_active,
  } = req.body;
  const updatedPitch = await sequelize.query(
    `UPDATE pitch_${futsalCode} SET name = ?, pitch_type = ?, surface_type = ?, dimensions = ?, price_per_hour = ?, lighting = ?, indoor = ?, is_active = ? WHERE id = ?`,
    {
      type: QueryTypes.UPDATE,
      replacements: [
        name,
        pitch_type,
        surface_type,
        dimensions,
        price_per_hour,
        lighting,
        indoor,
        is_active,
        id,
      ],
    },
  );
  if (!updatedPitch) {
    return res.status(500).json({
      success: false,
      message: "failed to update pitch",
    });
  }
  res.status(200).json({
    success: true,
    message: "pitch updated successfully",
    data: updatedPitch,
  });
};

module.exports = {
  getPitches,
  getPitchById,
  createPitch,
  editPitch,
};

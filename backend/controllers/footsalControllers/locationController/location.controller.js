const { QueryTypes, where, DataTypes } = require("sequelize");
const { sequelize, Futsal } = require("../../../models");

//by futsal
const getFutsalLocation = async (req, res) => {
  const futsalCode = req.futsalCode;
  const futsalLocation = await sequelize.query(
    `SELECT * FROM location_${futsalCode}`,
    {
      type: QueryTypes.SELECT,
    },
  );
  if (!futsalLocation[0]) {
    return res.status(400).json({
      message: "futsal location not found",
    });
  }
  res.status(200).json({
    success: true,
    message: "futsal location fetch sucessfully",
    data: futsalLocation,
  });
};

//by futsal
const postFutsalLocation = async (req, res) => {
  const futsalCode = req.futsalCode;
  const {
    district,
    address,
    city,
    postal_code,
    latitude,
    longitude,
    full_address,
  } = req.body;

  if (!district || !adresss || !city || !longitude || !latitude) {
    return res.status(400).json({
      success: false,
      message:
        "district, address, city , longitude and latitude can't be empty !",
    });
  }
  var data;

  try {
    data = await sequelize.query(
      `INSERT INTO location_${futsalCode} (district,address,city,postal_code,latitude,longitude,full_address)
        VALUES (?,?,?,?,?,?,?)`,
      {
        replacements: [
          district,
          address,
          city,
          postal_code,
          latitude,
          longitude,
          full_address,
        ],
        type: DataTypes.INSERT,
      },
    );
  } catch {
    return res.status(400).json({
      success: false,
      message: "unable to insert location",
    });
  }
  res.status(200).json({
    success: true,
    message: "Location Inserted succesfully",
    data,
  });
};

// for futsal
const editFutsalLocation = async(req,res)=>{
    const futsalCode = req.futsalCode;
    const locationId = req.params.locationId;
    const {
    district,
    address,
    city,
    postal_code,
    latitude,
    longitude,
    full_address,
  } = req.body;

  const ifExitFutsalLocation = await sequelize.query(
    `SELECT * FROM location_${futsalCode} WHERE id=${locationId}`,{
        type: DataTypes.SELECT
    }
  )
  if(!ifExitFutsalLocation[0]){
    return res.status(400).json({
        success : false,
        message: "this location not found"
    })
  }


  const data = await sequelize.query(
    `UPDATE TABLE location_${futsalCode} (district,address,city,postal_code,latitude,longitude,full_address)
    values (?,?,?,?,?,?,?) WHERE id=${locationId}`,{
         replacements: [
          district,
          address,
          city,
          postal_code,
          latitude,
          longitude,
          full_address,
        ],
        type: QueryTypes.UPDATE,
      },
  )
  if(data.length < 1){
    return res.status(400).json({
        success: false,
        message: "can't update location data"
    })
  }
  res.status(200).json({
    success: true,
    message: "location updated successfully",
    data

  })

}

const getFutsalLocationByUser = async(req,res)=>{
  const {code} = req.tanent;
  const futsalLocation = await sequelize.query(
    `SELECT * FROM location_${code}`,
    {
      type: QueryTypes.SELECT,
    },
  );
  if (!futsalLocation[0]) {
    return res.status(400).json({
      message: "futsal location not found",
    });
  }
  res.status(200).json({
    success: true,
    message: "futsal location fetch sucessfully",
    data: futsalLocation, 
  });
}

module.exports = {
  getFutsalLocation, // by futsal
  postFutsalLocation, // by futsal
  editFutsalLocation, // by futsal
  getFutsalLocationByUser // by user
};

const {sequelize} = require("../../../models")
const {QueryTypes} = require("sequelize");
//by admin
const getTimeslot = (req,res)=>{
    const code = req.futsalCode || req.tanent.code;
    const {pitch_id, day_of_week} = req.query;

    if(!pitch_id || day_of_week === undefined){
        return res.status(400).json({error: "pitch_id and day_of_week are required"});
    }

    const query = `SELECT * FROM timeslot_${code} WHERE pitch_id = :pitch_id AND day_of_week = :day_of_week`;
    sequelize.query(query, {
        replacements: { pitch_id, day_of_week },
        type: QueryTypes.SELECT,
    })
    .then(timeslots => {
        res.json({timeslots});
    })
    .catch(err => {
        console.error("Error fetching timeslots:", err);
        res.status(500).json({error: "Internal server error"});
    });
}

const createTimeslot = (req,res)=>{
    const futsalCode = req.futsalCode;
    const {pitch_id, day_of_week, start_time, end_time, price, is_available} = req.body;

    if(!pitch_id || day_of_week === undefined || !start_time || !end_time){
        return res.status(400).json({error: "pitch_id, day_of_week, start_time and end_time are required"});
    }

    const query = `INSERT INTO timeslot_${futsalCode} (pitch_id, day_of_week, start_time, end_time, price, is_available) VALUES (:pitch_id, :day_of_week, :start_time, :end_time, :price, :is_available)`;
    sequelize.query(query, {
        replacements: { pitch_id, day_of_week, start_time, end_time, price, is_available },
        type: QueryTypes.INSERT,
    })
    .then(() => {
        res.status(201).json({message: "Timeslot created successfully"});
    })
    .catch(err => {
        console.error("Error creating timeslot:", err);
        res.status(500).json({error: "Internal server error"});
    });
}

const updateTimeslot = (req,res)=>{
    const futsalCode = req.futsalCode;
    const timeslotId = req.params.id;
    const {pitch_id, day_of_week, start_time, end_time, price, is_available} = req.body;

    const query = `UPDATE timeslot_${futsalCode} SET pitch_id = :pitch_id, day_of_week = :day_of_week, start_time = :start_time, end_time = :end_time, price = :price, is_available = :is_available WHERE id = :timeslotId`;
    sequelize.query(query, {
        replacements: { pitch_id, day_of_week, start_time, end_time, price, is_available, timeslotId },
        type: QueryTypes.UPDATE,
    })
    .then(() => {
        res.json({message: "Timeslot updated successfully"});
    })
    .catch(err => {
        console.error("Error updating timeslot:", err);
        res.status(500).json({error: "Internal server error"});
    });
}

const deleteTimeslot = (req,res)=>{
    const futsalCode = req.futsalCode;
    const timeslotId = req.params.id;

    const query = `DELETE FROM timeslot_${futsalCode} WHERE id = :timeslotId`;
    sequelize.query(query, {
        replacements: { timeslotId },
        type: QueryTypes.DELETE,
    })
    .then(() => {
        res.json({message: "Timeslot deleted successfully"});
    })
    .catch(err => {
        console.error("Error deleting timeslot:", err);
        res.status(500).json({error: "Internal server error"});
    });
}

module.exports = {
    getTimeslot,
    createTimeslot,
    updateTimeslot,
    deleteTimeslot
}
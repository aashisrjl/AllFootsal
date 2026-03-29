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
        let {pitch_id, day_of_week, start_time, end_time, price, is_available} = req.body;

    if(!pitch_id || day_of_week === undefined || !start_time || !end_time){
        return res.status(400).json({error: "pitch_id, day_of_week, start_time and end_time are required"});
    }

        // Convert and validate types
        pitch_id = parseInt(pitch_id);
        day_of_week = parseInt(day_of_week);
        price = price ? parseFloat(price) : null;
        is_available = is_available === true || is_available === 1 || is_available === "1" || is_available === "true" || is_available === "yes" ? 1 : 0;

        // Validate day_of_week (1-7)
        if(isNaN(day_of_week) || day_of_week < 1 || day_of_week > 7){
            return res.status(400).json({error: "day_of_week must be between 1-7"});
        }

        // Validate pitch_id is number
        if(isNaN(pitch_id)){
            return res.status(400).json({error: "pitch_id must be a number"});
        }

        // Validate time format (HH:MM or H:MM)
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if(!timeRegex.test(start_time) || !timeRegex.test(end_time)){
            return res.status(400).json({error: "start_time and end_time must be in HH:MM format (24-hour, e.g., 05:00, 14:30)"});
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
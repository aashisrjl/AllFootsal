const { QueryTypes } = require("sequelize");
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
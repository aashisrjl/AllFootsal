const { QueryTypes } = require("sequelize");
const {sequelize} = require("../../../models")
const {QueryTypes} = require("sequelize");
//by admin
const getTimeslot = (req,res)=>{
    const code = req.futsalCode || req.tanent.code;
    
}
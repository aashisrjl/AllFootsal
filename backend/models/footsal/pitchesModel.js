module.exports = (sequelize,DataTypes) =>{
    const Pitches = sequelize.define("footsal_pitches",{
        footsal_id:{
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'footsals',
                key: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
        // footsal owner can add multiple pitches with multiple spe cification in this tasble and can be booked separately
        name:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        pitch_type:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        surface_type:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        dimensions:{
            type: DataTypes.STRING,
            allowNull: true,
        },
        lighting:{
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        indoor:{
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },


    })
    return Pitches
    }

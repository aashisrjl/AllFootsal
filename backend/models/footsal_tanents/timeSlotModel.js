module.exports = (sequelize, DataTypes) => {
    const TimeSlot = sequelize.define("footsal_time_slots", {
        footsal_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'footsals',
                key: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
        pitch_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'footsal_pitches',
                key: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
        day_of_week: {
            type: DataTypes.INTEGER, // 0 (Sunday) to 6 (Saturday)
            allowNull: false,
            validate: {
                min: 0,
                max: 6
            }
        },
        start_time: {
            type: DataTypes.TIME,
            allowNull: false,
        },
        end_time: {
            type: DataTypes.TIME,
            allowNull: false,
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
    });

    return TimeSlot;
}
module.exports = (sequelize, DataTypes) => {
    const Booking = sequelize.define("footsal_booking", {
        footsal_id:{
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'footsals',
                key: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
        pitch_id:{
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'footsal_pitches',
                key: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
        user_id:{
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
        time_slot_id:{
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'footsal_time_slots',
                key: 'id'
            },
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE'
        },
        booking_date:{
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        status:{
            type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'completed'),
            defaultValue: 'pending',
        },
        total_amount:{
            type: DataTypes.DECIMAL(10,2),
            allowNull: false,
        },
        payment_status:{
            type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
            defaultValue: 'pending',
        },
        payment_id:{
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'footsal_payments',
                key: 'id'
            },
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE'
        },
        notes:{
            type: DataTypes.TEXT,
            allowNull: true,
        }
    });
    return Booking;
}
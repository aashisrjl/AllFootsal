module.exports = (sequelize, DataTypes) => {
    const Booking = sequelize.define("footsal_bookings", {
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
        booking_date:{
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        time_slot:{
            type: DataTypes.STRING,
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
        created_at:{
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updated_at:{
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        }
    })
    return Booking
}
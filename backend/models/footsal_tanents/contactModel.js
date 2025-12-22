module.exports = (sequelize, DataTypes) => {
    const Contact = sequelize.define("footsal_contact", {
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
        contact_phone: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        contact_email: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        qr_payment_url: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        deletedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },  
       
    })
    return Contact;
}
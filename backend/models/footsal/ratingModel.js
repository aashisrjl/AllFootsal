module.exports = (sequelize,DataTypes) => {
    const Rating = sequelize.define("footsal_rating" , {
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
        rating:{
            type: DataTypes.INTEGER,
            allowNull: false,
            validate:{
                min:1,
                max:5
            }
        },
        review:{
            type: DataTypes.TEXT,
            allowNull: true,
        },
        review_date:{
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        }

    })
    return Rating
}
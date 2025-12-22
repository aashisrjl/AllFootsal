module.exports = (sequelize, DataTypes) => {
    const Admin = sequelize.define("admin", {   
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: { isEmail: true }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        isSuperAdmin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });

    return Admin;
};

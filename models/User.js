module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define("user", {
        firstName : DataTypes.STRING,
        lastName : DataTypes.STRING,
        password: DataTypes.STRING,
        email : DataTypes.STRING,
        wallet : DataTypes.STRING               // FIXME : We should have a list of wallets adress for different currency
    });

    return User;
};

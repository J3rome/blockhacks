module.exports = function(sequelize, DataTypes) {
    var Currency = sequelize.define("currency", {
        name : DataTypes.STRING,
        active : DataTypes.BOOLEAN,
        rate : DataTypes.FLOAT
    });

    return Currency;
};

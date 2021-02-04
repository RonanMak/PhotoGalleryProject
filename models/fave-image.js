const Sequelize = require('sequelize');

const sequelize = require('../webdb/database');

const FaveImage = sequelize.define('faveImage', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    quantity: Sequelize.INTEGER
});

module.exports = FaveImage;
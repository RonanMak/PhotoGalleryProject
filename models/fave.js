const Sequelize = require('sequelize');

const sequelize = require('../webdb/database');

const Fave = sequelize.define('fave', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    }
});

module.exports = Fave;
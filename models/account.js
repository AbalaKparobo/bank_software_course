const Sequelize = require('sequelize');

const sequelize = require('../database');

const Account = sequelize.define('account', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    accountNumber: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true
    },
    accountType: {
        type: Sequelize.STRING,
        allowNull: false
    },
    accountBalance: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0
    },
    accountManagerName: {
        type: Sequelize.STRING,
    },
    accountManagerEmail: {
        type: Sequelize.STRING,
    },
    accountManagerTel: {
        type: Sequelize.STRING,
    }
}, {timestamps: false});

module.exports = Account;
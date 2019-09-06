const Sequelize = require('sequelize');

const sequelize = require('../database')

const Transaction = sequelize.define('transaction', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    refID: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    }, 
    amount: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    otherParty: {
        type: Sequelize.STRING,
        allowNull: false
    },
    details: {
        type: Sequelize.STRING
    },
    transactionType: {
        type: Sequelize.STRING,
        allowNull: false
    },
    transactionMethod: {
        type: Sequelize.STRING,
        allowNull: false
    },
    status: {
        type: Sequelize.STRING,
        allowNull: false
    },
    totalBalance: {
        type: Sequelize.FLOAT,
        allowNull: false
    }
}, {
    timestamps: true,
    updatedAt: false
});

module.exports = Transaction;
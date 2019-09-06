const Sequelize = require('sequelize');

// const sequelize = new Sequelize(process.env.db_name_local, 'root', process.env.db_password_local, {
//     dialect: 'mysql',
//     host: process.env.db_host_local
// });

const sequelize = new Sequelize(process.env.db_name, process.env.db_username, process.env.db_password, {
    dialect: 'mysql',
    host: process.env.db_host
});

module.exports = sequelize;
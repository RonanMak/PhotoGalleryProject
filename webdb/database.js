const Sequelize = require('sequelize');

const sequelize = new Sequelize('art-website', 'root', 'Abc92407068', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;



// const mysql = require('mysql2');

// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     database: 'art-website',
//     password: '123'
// });

// module.exports = pool.promise();

const { Sequelize } = require('sequelize')
const db = new Sequelize('blog', 'postgres', 'santoshthapa143', {
    host: 'localhost',
    dialect: 'postgres'
})
module.exports = db
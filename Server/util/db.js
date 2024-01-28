const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("attendance", "root", "1234", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;

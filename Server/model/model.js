const { Sequelize } = require("sequelize");

const sequelize = require("../util/db.js");

const AttendanceModel = sequelize.define("attendance", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  status: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

const DateModel = sequelize.define("dates", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  date: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

const StudentModel = sequelize.define("student", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = { AttendanceModel, DateModel, StudentModel };

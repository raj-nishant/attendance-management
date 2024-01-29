const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
// const { Sequelize } = require("sequelize");

const attendanceRoute = require("./Routes/attendanceRoute.js");

const sequelize = require("./util/db.js");
const {
  AttendanceModel,
  DateModel,
  StudentModel,
} = require("./model/model.js");

const app = express();

app.use(cors());

app.use(bodyParser.json({ extended: false }));

app.use("/", attendanceRoute);

AttendanceModel.belongsTo(StudentModel);
AttendanceModel.belongsTo(DateModel);
StudentModel.belongsToMany(DateModel, { through: AttendanceModel });
DateModel.belongsToMany(StudentModel, { through: AttendanceModel });

sequelize
  .sync()
  .then((result) => {
    app.listen(9000);
  })
  .catch((err) => console.error(err));

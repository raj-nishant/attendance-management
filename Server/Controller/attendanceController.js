const {
  AttendanceModel,
  DateModel,
  StudentModel,
} = require("../model/model.js");

const { Sequelize } = require("sequelize");
const sequelize = require("../util/db.js");

module.exports.getAttendance = async (req, res, next) => {
  try {
    const requestedDate = req.query.date;

    const foundDate = await DateModel.findOne({
      where: { date: requestedDate },
    });
    const studentsData = await StudentModel.findAll();

    const response = {
      attendanceDate: requestedDate,
      attendanceAvailable: !!foundDate,
      data: [],
    };

    if (foundDate) {
      const attendanceRecords = await AttendanceModel.findAll({
        where: { dateId: foundDate.id },
        include: [{ model: StudentModel, attributes: ["name"] }],
      });

      attendanceRecords.forEach((record) => {
        response.data.push({
          studentName: record.student.name,
          status: record.status,
        });
      });
    } else {
      studentsData.forEach((student) => {
        response.data.push({
          studentId: student.id,
          studentName: student.name,
          status: null,
        });
      });
    }

    res.json(response);
  } catch (error) {
    console.error("Error while processing attendance request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.postAttendance = async (req, res, next) => {
  try {
    console.log("post request....");

    const date = req.body.date;
    const data = req.body.data;

    const newDate = await DateModel.create({ date: date });

    data.forEach((element) => (element["dateId"] = newDate.id));
    // console.log(data);
    await AttendanceModel.bulkCreate(data);

    res.status(200).json({ status: "success" });
  } catch (err) {
    console.error("postAttendanceError: ", err);
    res.status(500).json({ status: "Internal Server Error" });
  }
};

module.exports.getReport = async (req, res, next) => {
  try {
    const days = await DateModel.findAll();

    const jsonData = {
      totalDays: days.length,
      data: [],
    };

    const result = await AttendanceModel.findAll({
      include: [
        {
          model: StudentModel,
          attributes: ["name"],
        },
      ],
      where: { status: "Present" },
      attributes: [
        "studentId",
        [sequelize.fn("count", Sequelize.col("studentId")), "presentCount"],
      ],
      group: ["studentId"],
    });

    console.log(result);
    result.forEach((elem) => {
      jsonData.data.push({
        studentName: elem.student.name,
        presentCount: elem.dataValues.presentCount,
      });
      // console.log(elem.student.name, elem.studentId, elem.dataValues.presentCount);
    });

    res.status(200).json(jsonData);
  } catch (err) {
    console.error("getReportError: ", err);
    res.status(500).json({ status: "Internal Server Error" });
  }
};

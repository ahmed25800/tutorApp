const Student = require("../models/student");
const Request = require("../models/request");
const Report = require("../models/report");

exports.addRequest = (req, res, next) => {
  const teacher_id = req.body.teacher_id;
  const userId = req.userId;
  const date = req.body.date;
  const addedRequest = new Request({
    teacher_id: teacher_id,
    student_id: userId,
    date: Date(date),
  });
  addedRequest
    .save()
    .then((request) => {
      res.status(201).json({
        Message: "Request Added Successfully",
        request: request,
      });
    })
    .catch((error) => {
      error.statusCode = 500;
      next(error);
    });
};
exports.cancelRequest = (req, res, next) => {
  try {
    const id = req.params.requestId;
    Request.findByIdAndUpdate(id, { state: "canceled" }).then((req) => {
      console.log(req);
      res.status(201).json({
        Message: "Request canceled",
      });
    });
  } catch (e) {
    if (!e.statusCode) {
      e.statusCode = 500;
    }
    next(e);
  }
};
exports.getRequests = (req, res, next) => {
  const userId = req.userId;
  Request.find({
    student_id: userId,
    $or: [{ state: "accepted" }, { state: "pending" }, { state: "rejected" }],
  })
    .sort({ date: -1 })
    .populate(["teacher_id", "student_id"])
    .then((requests) => {
      res.status(200).json(requests);
    });
};
exports.report = (req, res, next) => {
  try {
    const student_id = req.userId;
    const teacher_id = req.body.teacher_id;
    const reason = req.body.reason;
    const report = new Report({
      student_id: student_id,
      teacher_id: teacher_id,
      reason: reason,
    });
    report.save().then((report) => {
      res.status(201).json({
        Message: "Report Added Successfully",
        report: report,
      });
    });
  } catch (e) {
    if (!e.statusCode) {
      e.statusCode = 500;
    }
    next(e);
  }
};

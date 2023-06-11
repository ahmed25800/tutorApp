const teacher = require("../models/teacher");
const Teacher = require("../models/teacher");
const Subject = require("../models/subject");
const Request = require("../models/request");
const base = require("../base46_helper");
const user = require("../models/user");
exports.getTutors = async (req, res, next) => {
  let search = req.query.search;
  let show = req.query.show;
  let subject = req.query.subj;
  console.log(subject);
  if (show === "top") {
    Teacher.find({ rating: { $gt: 2 } })
      .populate(["user", "state"])
      .then((tutors) => {
        let filteredTutors;
        // Filter the tutors based on the name of the user
        if (search) {
          filteredTutors = tutors.filter((tutor) => {
            return tutor.user.name.includes(search);
          });
        } else {
          filteredTutors = tutors;
        }

        res.status(200).json(filteredTutors);
      });
  } else if (subject) {
    Teacher.find({ state: subject })
      .sort({ rating: -1 })
      .populate(["user", "state"])
      .then((tutors) => {
        let filteredTutors;
        // Filter the tutors based on the name of the user
        if (search) {
          filteredTutors = tutors.filter((tutor) => {
            return tutor.user.name.includes(search);
          });
        } else {
          filteredTutors = tutors;
        }

        res.status(200).json(filteredTutors);
      });
  } else {
    Teacher.find()
      .populate(["user", "state"])
      .sort({ rating: -1 })
      .then((tutors) => {
        let filteredTutors;
        // Filter the tutors based on the name of the user
        if (search) {
          filteredTutors = tutors.filter((tutor) => {
            return tutor.user.name.includes(search);
          });
        } else {
          filteredTutors = tutors;
        }

        res.status(200).json(filteredTutors);
      });
  }
};
exports.addSubjects = (req, res, next) => {
  const subject_name = req.body.name;
  const image = req.body.image;
  const imagePath = base(image);
  const subject = new Subject({
    subject_name: subject_name,
    image: imagePath,
  });
  subject.save().then((subject) =>
    res.status(201).json({
      Message: "Success",
      subject: subject,
    })
  );
};
exports.getSubjects = (req, res, next) => {
  Subject.find().then((subjects) => res.status(200).json(subjects));
};
exports.acceptRequest = (req, res, next) => {
  try {
    const comment = req.body.comment;
    const id = req.params.id;
    Request.findByIdAndUpdate(id, { state: "accepted", comment: comment }).then(
      (_) => {
        res.status(201).json({
          Message: "Request Accepted",
        });
      }
    );
  } catch (e) {
    if (!e.statusCode) {
      e.statusCode = 500;
    }
    next(e);
  }
};
exports.rejectRequest = (req, res, next) => {
  try {
    const id = req.params.id;
    const comment = req.body.comment;
    console.log(id);
    Request.findByIdAndUpdate(id, { state: "rejected", comment: comment }).then(
      (r) => {
        console.log(r);
        res.status(201).json({
          Message: "Request Rejected",
        });
      }
    );
  } catch (e) {
    if (!e.statusCode) {
      e.statusCode = 500;
    }
    next(e);
  }
};
exports.getRequests = (req, res, next) => {
  const userId = req.userId;
  Request.find({ teacher_id: userId, state: "pending" })
    .populate(["student_id", "teacher_id"])
    .then((requests) => {
      res.status(200).json(requests);
    });
};
exports.getSchedule = async (req, res, next) => {
  const userId = req.userId;
  let teacher = await Teacher.findOne({ user: userId }).populate("state");
  console.log("schedule");
  console.log(teacher);
  Request.find({ teacher_id: userId, state: "accepted" })
    .populate(["student_id", "teacher_id"])
    .then((requests) => {
      requests.forEach((e) => (e.subject = teacher.state.subject_name));
      res.status(200).json(requests);
    });
};
//, subject: teacher.state.subject_name

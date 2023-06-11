const bcrypt = require("bcryptjs");
const User = require("../models/user");
const Teacher = require("../models/teacher");
const jwt = require("jsonwebtoken");
const Student = require("../models/student");
const teacher = require("../models/teacher");
const base = require("../base46_helper");
const Request = require("../models/request");
const nodemailer = require("nodemailer");
exports.register = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  const phone_number = req.body.phone_number;
  const age = req.body.age;
  const role = req.body.role;
  const subject = req.body.state;
  const gender = req.body.gender;
  const location = req.body.location;
  const image = req.body.image;
  const certificate = req.body.certificate;
  console.log(certificate);

  try {
    const user = await User.findOne({ email: email });
    if (user) {
      const error = new Error("User already exists");
      error.statusCode = 422;
      throw error;
    }
    const hashedPassword = await bcrypt.hash(password, 8);
    const imagePath = base(image);

    const newUser = new User({
      name: name,
      image: imagePath,
      gender: gender,
      email: email,
      phone_number: phone_number,
      password: hashedPassword,
      location: location,
      age: age,
      role: role,
      school_system: "aaa",
    });
    console.log("aaaa");
    const result = await newUser.save();
    console.log(result);
    const token = jwt.sign(
      { userId: result._id, role: result.role },
      "secretahmad"
    );
    newUser.jwtToken = token;
    await newUser.save().catch((e) => {
      console.log("error");
      console.log(e);
    });

    if (role == "tutor") {
      let certificatesBase = [];

      for (let i = 0; i < certificate.length; i++) {
        certificatesBase.push(base(certificate[i]));
      }

      const newTeacher = new Teacher({
        state: subject,
        user: newUser._id,
        certificate: certificatesBase,
      });
      await newTeacher.save();
      res.status(201).json({
        message: "User created successfully",
        parent: newTeacher,
        token: token,
      });
    } else {
      const newStudent = new Student({
        grade: 0,
        user: newUser._id,
      });
      await newStudent.save().then((student) => {
        console.log("sucesssss");
        console.log(student);
      });

      console.log("aaaa");
      console.log(newUser._id);
      res.status(201).json({
        message: "User created successfully",
        parent: newStudent,
        token: token,
      });
    }
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
};
exports.logIn = (req, res, next) => {
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  let loadedUser;
  User.findOne({ $or: [{ name: name }, { email: email }] })
    .then((user) => {
      console.log(user);
      if (!user) {
        const error = new Error("User Not Found");
        error.statusCode = 422;
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then(async (isEqual) => {
      if (!isEqual) {
        const error = new Error("Wrong Password");
        error.statusCode = 422;
        throw error;
      }
      const token = jwt.sign(
        { userId: loadedUser._id, role: loadedUser.role },
        "secretahmad"
      );
      if (loadedUser.role == "tutor") {
        const teacher = await Teacher.findOne({ user: loadedUser }).populate([
          "user",
          "state",
        ]);
        res.status(200).json({
          Message: "LoggedIn Successfully",
          token: token,
          parent: teacher,
        });
      } else {
        const student = await Student.findOne({ user: loadedUser }).populate(
          "user"
        );
        res.status(200).json({
          Message: "LoggedIn Successfully",
          token: token,
          parent: student,
        });
      }
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
exports.getProfile = (req, res, next) => {
  const userId = req.userId;
  const role = req.role;
  console.log(userId);
  try {
    if (role == "student") {
      Student.findOne({ user: userId })
        .populate("user")
        .then((student) => {
          if (!student) {
            const error = new Error("User Not Found");
            error.statusCode = 422;
            throw error;
          }
          res.status(200).json(student);
        });
    } else {
      Teacher.findOne({ user: userId })
        .populate(["user", "state"])
        .then((teacher) => {
          try {
            if (!teacher) {
              const error = new Error("User Not Found");
              error.statusCode = 422;
              throw error;
            }
            res.status(200).json(teacher);
          } catch (err) {
            if (!err.statusCode) {
              err.statusCode = 500;
            }
            next(err);
          }
        });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deactivateAcc = async (req, res, next) => {
  const userId = req.userId;
  const role = req.role;
  if (role == "tutor") {
    Teacher.findOneAndDelete({ user: userId }).then((_) => {
      User.findByIdAndDelete(userId).then((user) => {
        Request.deleteMany({ teacher_id: userId }).then((_) => {
          res.status(201).json({
            Message: "Account Deleted Successfully",
          });
        });
      });
    });
  } else {
    console.log(userId);
    Student.findOneAndDelete({ user: userId }).then((student) => {
      console.log(student);
      if (student) {
        User.findByIdAndDelete(userId).then((user) => {
          Request.deleteMany({ student_id: userId }).then((_) => {
            res.status(201).json({
              Message: "Account Deleted Successfully",
            });
          });
        });
      }
    });
  }
};
let codes = {};
exports.sendEmail = (req, res, next) => {
  // let transporter = nodemailer.createTransport({
  //   service: "gmail",
  //   auth: {
  //     type: "OAuth2",
  //     user: process.env.MAIL_USERNAME,
  //     pass: process.env.MAIL_PASSWORD,
  //     clientId: process.env.OAUTH_CLIENTID,
  //     clientSecret: process.env.OAUTH_CLIENT_SECRET,
  //     refreshToken: process.env.OAUTH_REFRESH_TOKEN,
  //   },
  // });
  let transporter = nodemailer.createTransport({
    service: "gmail", // true for 465, false for other ports
    auth: {
      user: "testflutter221@gmail.com", // generated ethereal user
      pass: "hgpcdfzqoaggzehp", // generated ethereal password
    },
  });

  let generateCode = () => {
    let code = "";
    let characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 6; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
  };
  let email = req.body.email;
  if (!email) {
    res.status(400).send("Email address is required");
    return;
  }
  let code = generateCode();
  let mailOptions = {
    from: "testflutter221@gmail.com", // replace with your Gmail address
    to: email,
    subject: "Verification Code",
    text:
      "Dear recipient,\n\nYour verification code is: " +
      code +
      "\n\nBest regards,\nYour Name",
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.status(500).send("Failed to send verification code");
    } else {
      console.log("Verification code sent to " + email);
      codes[email] = code;
      res.status(201).send("Verification code sent");
    }
  });
};
exports.confirmCode = (req, res, next) => {
  try {
    let email = req.body.email;
    let code = req.body.code;
    if (!email || !code) {
      res.status(400).send("Email address and code are required");
      return;
    }
    console.log(codes[email]);
    console.log(code);
    console.log(codes);
    if (codes[email] === code) {
      console.log("Verification code confirmed for " + email);
      delete codes[email];
      res.status(201).send("Verification code confirmed");
    } else {
      const error = new Error("Incorrect verification code");
      error.statusCode = 422;
      throw error;
      // console.log("Incorrect verification code for " + email);
      // res.status(401).send();
    }
  } catch (e) {
    if (!e.statusCode) {
      e.statusCode = 500;
    }
    next(e);
  }
};
exports.forgotPassword = (req, res, next) => {
  const email = req.body.email;
  const newPassword = req.body.newPassword;
  console.log(newPassword);
  console.log(email);

  User.findOne({ email: email })
    .then((user) => {
      bcrypt
        .hash(newPassword, 8)
        .then((pass) => {
          user.password = pass;
          console.log(pass);
          console.log("wwwww");
          return user.save().then((user) => {
            console.log("qqqq");
            res.status(201).json({
              Message: "Passowrd Changed Successfully",
            });
          });
        })
        .catch((e) => {
          console.log(e);
          if (!e.statusCode) {
            e.statusCode = 500;
          }
          next(e);
        });
    })
    .catch((e) => {
      console.log(e);
      if (!e.statusCode) {
        e.statusCode = 500;
      }
      next(e);
    });
};
exports.changePassword = (req, res, next) => {
  const userId = req.userId;
  const newPassword = req.body.newPassword;
  User.findById(userId)
    .then(async (user) => {
      const hashedPassword = await bcrypt.hash(newPassword, 8);
      user.password = hashedPassword;
      user.save().then((user) =>
        res.status(201).json({
          Message: "Passowrd Changed Successfully",
        })
      );
    })
    .catch((e) => {
      if (!e.statusCode) {
        e.statusCode = 500;
      }
      next(e);
    });
};

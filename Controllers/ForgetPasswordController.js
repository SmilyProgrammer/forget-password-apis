const nodemailer = require("nodemailer");
const ResetLink = require("../Models/ResetLink");
const User = require("../Models/User");
const md5 = require("md5");
const bcrypt = require("bcrypt");

/**
 * sendResetLink
 */
const sendResetLink = async (mail, hash) => {
  var transport = nodemailer.createTransport({
    host: "BlogSite.com",
    port: 2525,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  /**
   * send email with defined transport object
   */
  let info = await transport.senMail({
    from: '"Blog" <blogsite@info.com>',
    to: mail,
    subject: "Reset Password",
    text: "Welcome to BlogSite",
    html: `<div>
    <p><a href="http://127.0.0.1:4000/?hash=${hash}">Set a new Password</a></p>
    <p>Sincerely</p>
    <p>BlogSite</p>
    </div>`,
  });
  return true;
};

/**
 * resetLink
 */
const resetLink = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });

    if (user != null) {
      let currentTimeStamp = new Date().getTime();
      let fiveMin = 60 * 5 * 1000;
      let expire = currentTimeStamp + fiveMin;
      let hash = md5(currentTimeStamp);
      await ResetLink.create({
        hash,
        email: req.body.email,
        expire,
      });

      /**
       * sendResetLink
       */
      await sendResetLink(req.body.email, hash);

      res.status(201).json({
        success: true,
        message: "Check Your Eamil",
      });
    } else {
      res.json({
        success: false,
        message: "User not found",
      });
    }
  } catch (error) {
    res.status(401).json({
      success: false,
      errorName: error.name,
      message: error.message,
    });
  }
};

/**
 * forgetPassword
 */
const forgetPassword = async (req, res) => {
  let result = ResetLink.findOne({ hash: req.body.hash });

  if (result != null) {
    let currentTime = new Date().getTime();
    console.log(`Current Time : ${currentTime}`);
    console.log(`Expire : ${result.expire}`);
    if (Number(result.expire) > currentTime) {
      if (req.body.new_password == req.body.confirm_password) {
        let salt = await bcrypt.genSalt();
        let hashPassowrd = await bcrypt.hash(req.body.new_password, salt);
        await User.findOneAndUpdate(
          { email: result.email },
          {
            password: hashPassowrd,
          }
        );
        res.status(200).json({
          success: true,
          message: "Your password has updated successfully",
        });
      } else {
        res.status(401).json({
          success: false,
          message: "new password and confirm password are not same!",
        });
      }
    } else {
      res.status(401).json({
        success: false,
        message: "Your link has expired",
      });
    }
  } else {
    res.status(401).json({
      success: false,
      message: "Invalid Link",
    });
  }
};

module.exports = {
  resetLink,
  forgetPassword,
};

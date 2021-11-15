/*  COMP229-013 F2021
    Group Project Part 2 First Release
    File Name:  controllers/index.js
    Student#:   
    Name:       
    Date:       
 */

// require modules
let express = require("express");
let router = express.Router();
let mongoose = require("mongoose");
let passport = require("passport");

// create the User Model instance
let userModel = require("../models/user");
let User = userModel.User; // alias

// logic
module.exports.displayHomePage = (req, res, next) => {
  res.render("home", {
    title: "Home",
  });
};

module.exports.displayCreateSurveyPage = (req, res, next) => {
  res.render("createSurvey", {
    title: "Create Survey",
  });
};

module.exports.displayCreateMCQsurveyPage = (req, res, next) => {
  res.render('createMCQ', {title: 'Create Multiple-choice Survey',displayName: req.user ? req.user.displayName : ''});
}

module.exports.displayMySurveysPage = (req, res, next) => {
  res.render("mySurveys", {
    title: "My Surveys",
  });
};

module.exports.displayLoginPage = (req, res, next) => {
  // check if the user is already logged in
  if (!req.user) {
    res.render("auth/login", {
      title: "Login",
      messages: req.flash("loginMessage"),
      displayName: req.user ? req.user.displayName : "",
    });
  } else {
    return res.redirect("/");
  }
};

module.exports.processLoginPage = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    // server error?
    if (err) {
      return next(err);
    }
    // is there a user login error?
    if (!user) {
      req.flash("loginMessage", "Authentication Error");
      return res.redirect("/login");
    }
    req.login(user, (err) => {
      // server error?
      if (err) {
        return next(err);
      }
      return res.redirect("/contact-list");
    });
  })(req, res, next);
};

module.exports.displayRegisterPage = (req, res, next) => {
  // check if the user is not already logged in
  if (!req.user) {
    res.render("auth/register", {
      title: "Register",
      messages: req.flash("registerMessage"),
      displayName: req.user ? req.user.displayName : "",
    });
  } else {
    return res.redirect("/");
  }
};

module.exports.processRegisterPage = (req, res, next) => {
  // instantiate a user object
  let newUser = new User({
    username: req.body.username,
    //password: req.body.password
    email: req.body.email,
    displayName: req.body.displayName,
  });

  User.register(newUser, req.body.password, (err) => {
    if (err) {
      console.log("Error: Inserting New User");
      if (err.name == "UserExistsError") {
        req.flash(
          "registerMessage",
          "Registration Error: User Already Exists!"
        );
        console.log("Error: User Already Exists!");
      }
      return res.render("auth/register", {
        title: "Register",
        messages: req.flash("registerMessage"),
        displayName: req.user ? req.user.displayName : "",
      });
    } else {
      // if no error exists, then registration is successful

      // redirect the user and authenticate them

      return passport.authenticate("local")(req, res, () => {
        res.redirect("/contact-list");
      });
    }
  });
};

module.exports.performLogout = (req, res, next) => {
  req.logout();
  res.redirect("/");
};
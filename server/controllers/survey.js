/*  COMP229-013 F2021
    Group Project Part 2 First Release
    File Name:  controllers/survey.js
    Student#:   
    Name:       
    Date:       
 */

// require modules
let express = require("express");
let router = express.Router();
let mongoose = require("mongoose");

// create a reference to the model
let Survey = require("../models/survey");

// logic
module.exports.displaySurveyList = (req, res, next) => {
  Survey.find((err, surveyList) => {
    if (err) {
      return console.error(err);
    } else {
      res.render("surveyAdmin/mySurveys", {
        title: "My Surveys",
        SurveyList: surveyList,
        displayName: req.user ? req.user.displayName : "",
      });
    }
  });
};

module.exports.displayCreateSurveyPage = (req, res, next) => {
  res.render("createSurvey", {
    title: "Create Survey",
  });
};

module.exports.displayCreateMCQSurveyPage = (req, res, next) => {
  res.render("createMCQ", {
    title: "Create Multiple-choice Survey",
    displayName: req.user ? req.user.displayName : "",
  });
};

module.exports.displayAddPage = (req, res, next) => {
  res.render("contact/add", {
    title: "Add Contact",
    displayName: req.user ? req.user.displayName : "",
  });
};

module.exports.processAddPage = (req, res, next) => {
  let newContact = Contact({
    contactName: req.body.contactName,
    contactNumber: req.body.contactNumber,
    emailAddress: req.body.emailAddress,
  });

  Contact.create(newContact, (err, Contact) => {
    if (err) {
      console.log(err);
      res.end(err);
    } else {
      // refresh the business contact list
      res.redirect("/surveys");
    }
  });
};

module.exports.displayUpdatePage = (req, res, next) => {
  let id = req.params.id;

  Contact.findById(id, (err, contactToUpdate) => {
    if (err) {
      console.log(err);
      res.end(err);
    } else {
      // show the edit view
      res.render("contact/update", {
        title: "Update Contact",
        contact: contactToUpdate,
        displayName: req.user ? req.user.displayName : "",
      });
    }
  });
};

module.exports.processUpdatePage = (req, res, next) => {
  let id = req.params.id;

  let updatedContact = Contact({
    _id: id,
    contactName: req.body.contactName,
    contactNumber: req.body.contactNumber,
    emailAddress: req.body.emailAddress,
  });

  Contact.updateOne({ _id: id }, updatedContact, (err) => {
    if (err) {
      console.log(err);
      res.end(err);
    } else {
      // refresh the contact list
      res.redirect("/surveys");
    }
  });
};

module.exports.performDelete = (req, res, next) => {
  let id = req.params.id;

  Contact.remove({ _id: id }, (err) => {
    if (err) {
      console.log(err);
      res.end(err);
    } else {
      // refresh the contact list
      res.redirect("/surveys");
    }
  });
};

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
  res.render("surveyAdmin/createSurvey", {
    title: "Create Survey",
  });
};

module.exports.processCreateSurveyPage = (req, res, next) => {
  let newSurvey = Survey({
    "Title": req.body.title,
    "DueDate": req.body.duedate,
    "Description": req.body.description
  });

  Survey.create(newSurvey, (err, survey) => {
    if (err) {
        console.log(err);
        res.end(err);
    } else {
        res.redirect('/')
        //res.redirect('/survey/addtfquestion');
    }
  });
};

module.exports.displayCreateMCQSurveyPage = (req, res, next) => {
  res.render("createMCQ", {
    title: "Create Multiple-choice Survey",
    displayName: req.user ? req.user.displayName : "",
  });
};

module.exports.displayUpdateSurveyPage = (req, res, next) => {
  let id = req.params.id;

  Survey.findById(id, (err, surveyToEdit) => {
      if (err) 
      {
          console.log(err);
          res.end(err);
      } 
      else 
      {
          //show the update view
          res.render('surveyAdmin/updateSurvey',
          {title: 'Edit Survey', survey: surveyToEdit})
      }
  });
} 

module.exports.processUpdateSurveyPage = (req, res, next) => {
  let id = req.params.id;

    let updatedSurvey = Survey({
        "_id": id,
        "Title": req.body.title,
        "DueDate": req.body.duedate,
        "Description": req.body.description
    });

    Survey.updateOne({_id: id}, updatedSurvey, (err) => {
        if (err) 
        {
            console.log(err);
            res.end(err);
        } 
        else 
        {
            // refresh the book list
            res.redirect('/');
        }
    });
}

module.exports.performDelete = (req, res, next) => {
  let id = req.params.id;

  Survey.remove({ _id: id }, (err) => {
    if (err) {
      console.log(err);
      res.end(err);
    } else {
      // refresh the contact list
      res.redirect("/surveys");
    }
  });
};

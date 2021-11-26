/*  COMP229-013 F2021
    Group Project Part 2 First Release - Smart Survey
    File Name:   server/controllers/survey.js
    Student#:    301147411, 301182173, 301163120, 301168420, 301182196, 301159644 
    Name:        Marcus Ngooi, Tatsiana Ptushko, Josef Signo, Sukhmannat Singh, Yuko Yamano, Agustin Ignacio Zuluaga
    Description: Logic for survey administration (will be locked behind authentication in next release)   
 */

// require modules
let express = require("express");
let router = express.Router();
let mongoose = require("mongoose");

// create a reference to the model
let Survey = require("../models/survey");
let Question = require("../models/question");
let Option = require("../models/option");
let Response = require("../models/surveyResponse");
let Answer = require("../models/answer");

// logic
module.exports.displaySurveyList = (req, res, next) => {
  let id = req.user._id;

  Survey.find({ userId: id }, (err, surveyList) => {
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
    displayName: req.user ? req.user.displayName : "",
  });
};

module.exports.displayMCQSurveyPage = (req, res, next) => {
  res.render("surveyAdmin/createSurvey", {
    title: "Create MCQ Survey",
    displayName: req.user ? req.user.displayName : "",
  });
};

module.exports.displayTFSurveyPage = (req, res, next) => {
  res.render("surveyAdmin/createSurvey", {
    title: "Create T/F Survey",
    displayName: req.user ? req.user.displayName : "",
  });
};

module.exports.processCreateSurveyPage = (req, res, next) => {
  let newSurvey = Survey({
    title: req.body.title,
    description: req.body.description,
    expirationDate: req.body.expirationDate,
    userId: req.user._id,
  });

  Survey.create(newSurvey, (err, survey) => {
    if (err) {
      console.log(err);
      res.end(err);
    } else {
      res.redirect("/");
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
    if (err) {
      console.log(err);
      res.end(err);
    } else {
      //show the update view
      res.render("surveyAdmin/updateSurvey", {
        title: "Edit Survey",
        survey: surveyToEdit,
      });
    }
  });
};

module.exports.processUpdateSurveyPage = (req, res, next) => {
  let id = req.params.id;

  let updatedSurvey = Survey({
    _id: id,
    title: req.body.title,
    description: req.body.description,
    expiractionDate: req.body.duedate,
    userId: req.user._id,
  });

  Survey.updateOne({ _id: id }, updatedSurvey, (err) => {
    if (err) {
      console.log(err);
      res.end(err);
    } else {
      // refresh the book list
      res.redirect("/");
    }
  });
};

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

module.exports.displayShowResultSurveyPage = (req, res, next) => {
  res.render("surveyAdmin/showResult", {
    title: "Result",
  });
};

module.exports.displayRespondSurveyPage = (req, res, next) => {
  let surveyId = req.params.id;
  let Index = req.params.index;
  let newIndex = parseInt(Index, 10) + 1;
  let optionId;

  // for (let count = 0; count < req.OptionList.length; count++) {
  //   if (req.OptionList[count].checked) {
  //     optionId = req.OptionList[count]._id;
  //   }
  // }

  let newResponse = Response({
    dateAnswered: new Date().toUTCString(),
    surveyId: surveyId,
  });
  if (Index == 1) {
    Response.create(newResponse, (err, Response) => {
      if (err) {
        console.log(err);
        res.end(err);
      }
    });
  }

  Question.find({ surveyId: surveyId }).exec((err, questionList) => {
    if (err) {
      return console.error(err);
    } else {
      if (parseInt(Index, 10) >= 1) {
        let newAnswer = Answer({
          questionId: questionList[Index - 1].id,
          optionId: optionId,
          surveyResponseId: surveyId,
        });
        Answer.create(newAnswer, (err, Answer) => {
          if (err) {
            console.log(err);
            res.end(err);
          }
        });
      }
      if (parseInt(Index, 10) == questionList.length) {
        res.redirect("/");
      } else {
        let questId = questionList[Index]._id;
        Option.find({ questionId: questId }).exec((err, optionList) => {
          if (err) {
            return console.error(err);
          } else {
            res.render("surveyAdmin/respondSurvey", {
              title: "Answer the Questions of the Survey",
              SurveyId: surveyId,
              QuestionList: questionList,
              NewIndex: newIndex,
              OptionList: optionList,
              displayName: req.user ? req.user.displayName : "",
            });
          }
        });
      }
    }
  });
};

// module.exports.processRespondSurveyPage = (req, res, next) => {
//   let surveyId = req.params.id;
//   let Index = req.params.index;
//   let optionId = req.body.option;

//   Question.find({ surveyId: surveyId }).exec((err, questionList) => {
//     if (err) {
//       return console.error(err);
//     } else {
//       if (parseInt(Index, 10) >= 0) {
//         console.log("This works");
//         let newAnswer = Answer({
//           questionId: questionList[Index].id,
//           optionId: optionId,
//           surveyResponseId: surveyId,
//         });
//         Answer.create(newAnswer, (err, Answer) => {
//           if (err) {
//             console.log(err);
//             res.end(err);
//           } else {
//             res.redirect("/surveys/respondSurvey/" + surveyId + "/" + parseInt(Index + 1, 10));
//           }
//         });
//       }
//     }
//   });
// };

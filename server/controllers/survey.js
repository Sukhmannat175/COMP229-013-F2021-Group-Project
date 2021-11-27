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
  res.render("surveyAdmin/createMCQ", {
    title: "MCQ Survey",
    displayName: req.user ? req.user.displayName : "",
  });
};

module.exports.processMCQSurveyPage = (req, res, next) => {
  let newSurvey = Survey({
    title: req.body.title,
    expirationDate: req.body.duedate,
    description: req.body.description,
    userId: req.user._id,
  });

  Survey.create(newSurvey, (err, survey) => {
    if (err) {
      console.log(err);
      res.end(err);
    } else {
      res.redirect("/surveys/addMCQQuestions/" + survey._id);
      //res.redirect('/survey/addtfquestion');
    }
  });
};

module.exports.displayAddMCQQuestions = (req, res, next) => {
  let id = req.params.id;

  Survey.findById(id, (err, survey) => {
    if (err) {
      return console.error(err);
    } else {
      Question.find({ surveyId: id }).exec((err, questionList) => {
        if (err) {
          return console.error(err);
        } else {
          Option.find({ surveyId: survey._id }).exec((err, optionList) => {
            if (err) {
              return console.error(err);
            } else {
              res.render("surveyAdmin/createMCQ", {
                title: "Creating Survey...",
                Survey: survey,
                QuestionList: questionList,
                OptionList: optionList,
                displayName: req.user ? req.user.displayName : "",
              });
            }
          });
        }
      });
    }
  });
};

module.exports.processAddMCQQuestions = (req, res, next) => {
  let id = req.params.id;

  let newQuestion = Question({
    surveyId: id,
  });

  Question.create(newQuestion, (err, question) => {
    if (err) {
      return console.error(err);
    } else {
      res.redirect("/surveys/addOneMCQQuestion/" + question._id);
    }
  });
};

module.exports.displayOneMCQQuestion = (req, res, next) => {
  let id = req.params.id;

  Question.findById(id, (err, question) => {
    if (err) {
      return console.error(err);
    } else {
      Survey.findById(question.surveyId, (err, survey) => {
        if (err) {
          return console.error(err);
        } else {
          Question.find({ surveyId: survey._id }).exec((err, questionList) => {
            if (err) {
              return console.error(err);
            } else {
              Option.find({ surveyId: survey._id }).exec((err, optionList) => {
                if (err) {
                  return console.error(err);
                } else {
                  console.log(questionList);
                  res.render("surveyAdmin/createMCQ", {
                    title: "Creating Question...",
                    Survey: survey,
                    Question: question,
                    QuestionList: questionList,
                    OptionList: optionList,
                    displayName: req.user ? req.user.displayName : "",
                  });
                }
              });
            }
          });
        }
      });
    }
  });
};

module.exports.processOneMCQQuestion = (req, res, next) => {
  let id = req.params.id;

  let updatedQuestion = Question({
    _id: id,
    title: req.body.newquestion,
    surveyID: req.body.surveyiD,
  });

  Question.updateOne({ _id: id }, updatedQuestion, (err) => {
    if (err) {
      return console.error(err);
    } else {
      res.redirect("/surveys/addOneMCQQuestion/addOptions/" + id);
    }
  });
};

module.exports.processCancelMCQQuestion = (req, res, next) => {
  let id = req.params.id;

  Question.findById(id, (err, question) => {
    if (err) {
      return console.error(err);
    } else {
      Survey.findById(question.surveyId, (err, survey) => {
        if (err) {
          return console.error(err);
        } else {
          Question.remove({ _id: id }, (err) => {
            if (err) {
              return console.error(err);
            } else {
              res.redirect("/surveys/addMCQQuestions/" + survey._id);
            }
          });
        }
      });
    }
  });
};

module.exports.displayAddOptions = (req, res, next) => {
  let id = req.params.id;

  Question.findById(id, (err, question) => {
    if (err) {
      return console.error(err);
    } else {
      Survey.findById(question.surveyId, (err, survey) => {
        if (err) {
          return console.error(err);
        } else {
          Question.find({ surveyId: survey._id }).exec((err, questionList) => {
            if (err) {
              return console.error(err);
            } else {
              Option.find({ surveyId: survey._id }).exec((err, optionList) => {
                if (err) {
                  return console.error(err);
                } else {
                  res.render("surveyAdmin/createMCQ", {
                    title: "Adding Options...",
                    Survey: survey,
                    Question: question,
                    QuestionList: questionList,
                    OptionList: optionList,
                    displayName: req.user ? req.user.displayName : "",
                  });
                }
              });
            }
          });
        }
      });
    }
  });
};

module.exports.processAddOptions = (req, res, next) => {
  let id = req.params.id;

  let option1 = Option({
    title: req.body.option1,
    questionId: id,
    surveyId: req.body.surveyid,
  });

  let option2 = Option({
    title: req.body.option2,
    questionId: id,
    surveyId: req.body.surveyid,
  });

  let option3 = Option({
    title: req.body.option3,
    questionId: id,
    surveyId: req.body.surveyid,
  });

  let option4 = Option({
    title: req.body.option4,
    questionId: id,
    surveyId: req.body.surveyid,
  });

  Option.create(option1, (err, Option1) => {
    if (err) {
      return console.error(err);
    } else {
      Option.create(option2, (err, Option2) => {
        if (err) {
          return console.error(err);
        } else {
          Option.create(option3, (err, Option3) => {
            if (err) {
              return console.error(err);
            } else {
              Option.create(option4, (err, Option4) => {
                if (err) {
                  return console.error(err);
                } else {
                  res.redirect("/surveys/addMCQQuestions/" + req.body.surveyid);
                }
              });
            }
          });
        }
      });
    }
  });
};

module.exports.displayTFSurveyPage = (req, res, next) => {
  res.render("surveyAdmin/createSurvey", {
    title: "Create T/F Survey",
    displayName: req.user ? req.user.displayName : "",
  });
};

module.exports.displayUpdateSurveyPage = (req, res, next) => {
  let id = req.params.id;

  Survey.findById(id, (err, survey) => {
    if (err) {
      return console.error(err);
    } else {
      Question.find({ surveyId: id }).exec((err, questionList) => {
        if (err) {
          return console.error(err);
        } else {
          Option.find({ surveyId: survey._id }).exec((err, optionList) => {
            if (err) {
              return console.error(err);
            } else {
              res.render("surveyAdmin/updateSurvey", {
                title: "Edit Survey",
                Survey: survey,
                QuestionList: questionList,
                OptionList: optionList,
                displayName: req.user ? req.user.displayName : "",
              });
            }
          });
        }
      });
    }
  });
};

module.exports.processUpdateSurveyPage = (req, res, next) => {
  let id = req.params.id;

  let updatedSurvey = Survey({
    _id: id,
    title: req.body.title,
    expirationDate: req.body.duedate,
    description: req.body.description,
  });

  Survey.updateOne({ _id: id }, updatedSurvey, (err) => {
    if (err) {
      console.log(err);
      res.end(err);
    } else {
      // refresh the book list
      res.redirect("/surveys");
    }
  });
};

module.exports.displayUpdateQuestionPage = (req, res, next) => {
  let id = req.params.id;

  Question.findById(id, (err, question) => {
    if (err) {
      return console.error(err);
    } else {
      console.log(question);
      Survey.findById(question.surveyId, (err, survey) => {
        if (err) {
          return console.error(err);
        } else {
          console.log(survey);
          Option.find({ questionId: id }).exec((err, optionList) => {
            if (err) {
              return console.error(err);
            } else {
              res.render("surveyAdmin/updateSurvey", {
                title: "Editing Question...",
                Survey: survey,
                Question: question,
                OptionList: optionList,
                displayName: req.user ? req.user.displayName : "",
              });
            }
          });
        }
      });
    }
  });
};

module.exports.processUpdateQuestionPage = (req, res, next) => {
  let id = req.params.id;

  let updatedQuestion = Question({
    _id: id,
    title: req.body.question,
    surveyId: req.body.surveyid,
  });

  Question.updateOne({ _id: id }, updatedQuestion, (err) => {
    if (err) {
      return console.error(err);
    } else {
      Question.findById(id, (err, question) => {
        if (err) {
          return console.error(err);
        } else {
          Survey.findById(question.surveyId, (err, survey) => {
            if (err) {
              return console.error(err);
            } else {
              console.log(survey);
              Option.find({ questionId: id }).exec((err, optionList) => {
                if (err) {
                  return console.error(err);
                } else {
                  let option1 = Option({
                    _id: optionList[0].id,
                    title: req.body.option1,
                    questionId: id,
                    surveyId: req.body.surveyid,
                  });

                  let option2 = Option({
                    _id: optionList[1].id,
                    title: req.body.option2,
                    questionId: id,
                    surveyId: req.body.surveyid,
                  });

                  let option3 = Option({
                    _id: optionList[2].id,
                    title: req.body.option3,
                    questionId: id,
                    surveyId: req.body.surveyid,
                  });

                  let option4 = Option({
                    _id: optionList[3].id,
                    title: req.body.option4,
                    questionId: id,
                    surveyId: req.body.surveyid,
                  });

                  Option.updateOne(
                    { _id: optionList[0].id },
                    option1,
                    (err) => {
                      if (err) {
                        return console.error(err);
                      } else {
                        Option.updateOne(
                          { _id: optionList[1].id },
                          option2,
                          (err) => {
                            if (err) {
                              return console.error(err);
                            } else {
                              Option.updateOne(
                                { _id: optionList[2].id },
                                option3,
                                (err) => {
                                  if (err) {
                                    return console.error(err);
                                  } else {
                                    Option.updateOne(
                                      { _id: optionList[3].id },
                                      option4,
                                      (err) => {
                                        if (err) {
                                          return console.error(err);
                                        } else {
                                          res.redirect(
                                            "/surveys/updateSurvey/" +
                                              survey._id
                                          );
                                        }
                                      }
                                    );
                                  }
                                }
                              );
                            }
                          }
                        );
                      }
                    }
                  );
                }
              });
            }
          });
        }
      });
    }
  });
};

module.exports.performDelete = (req, res, next) => {
  let id = req.params.id;

  Option.remove({ surveyId: id }, (err) => {
    Question.remove({ surveyId: id }, (err) => {
      Survey.remove({ _id: id }, (err) => {
        if (err) {
          console.log(err);
          res.end(err);
        } else {
          res.redirect("/surveys");
        }
      });
    });
  });
};

module.exports.displayShowResultSurveyPage = (req, res, next) => {
  res.render("surveyAdmin/showResult", {
    title: "Result",
    displayName: req.user ? req.user.displayName : "",
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

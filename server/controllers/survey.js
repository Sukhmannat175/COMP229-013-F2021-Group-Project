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

let optionArray = [];
let updateOptionArray = [];
let answerArray = [];

// logic
module.exports.displaySurveyList = (req, res, next) => {
  let id = req.user._id;
  updateOptionArray = [];
  answerArray = [];

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

module.exports.displayMCQSurveyPage = (req, res, next) => {
  optionArray = [];

  res.render("surveyAdmin/createMCQ", {
    title: "MCQ Survey",
    displayName: req.user ? req.user.displayName : "",
  });
};

module.exports.processMCQSurveyPage = (req, res, next) => {
  let newSurvey = Survey({
    title: req.body.title,
    type: "MCQ",
    expirationDate: req.body.expirationdate,
    description: req.body.description,
    userId: req.user._id,
  });

  Survey.create(newSurvey, (err, survey) => {
    if (err) {
      console.log(err);
      res.end(err);
    } else {
      res.redirect("/surveys/addMCQQuestions/" + survey._id);
    }
  });
};

module.exports.displayAddMCQQuestions = (req, res, next) => {
  let id = req.params.id;

  Survey.findById(id, (err, survey) => {
    if (err) {
      return console.error(err);
    } else {
      Question.find({surveyId: id }).exec((err, questionList) => {
        if (err) {
          return console.error(err);
        } else {          
          Option.find({surveyId: survey._id }).exec((err, optionList) => {
            if (err) {
              return console.error(err);
            } else {
              if (typeof questionList[questionList.length - 1] !== 'undefined') {
                Option.find({questionId: questionList[questionList.length - 1]._id}).exec((err, tempList) => {
                  if (err) {
                    return console.error(err);
                  } else {
                    optionArray.push(tempList);
                    res.render("surveyAdmin/createMCQ", {
                      title: "Creating Survey...",
                      Survey: survey,
                      QuestionList: questionList,
                      OptionList: optionList,
                      TempList: optionArray,
                      displayName: req.user ? req.user.displayName : "",
                    });
                  }
                });
              }
              else {
                res.render("surveyAdmin/createMCQ", {
                  title: "Creating Survey...",
                  Survey: survey,
                  QuestionList: questionList,
                  OptionList: optionList,
                  displayName: req.user ? req.user.displayName : "",
                });
              }
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
                  if (typeof questionList[questionList.length - 1] !== 'undefined') {
                    Option.find({questionId: questionList[questionList.length - 1]._id}).exec((err, tempList) => {
                      if (err) {
                        return console.error(err);
                      } else {
                        res.render("surveyAdmin/createMCQ", {
                          title: "Creating Question...",
                          Survey: survey,
                          QuestionList: questionList,
                          Question: question,
                          OptionList: optionList,
                          TempList: optionArray,
                          displayName: req.user ? req.user.displayName : "",
                        });
                      }
                    });
                  }
                  else {
                    res.render("surveyAdmin/createMCQ", {
                      title: "Creating Question...",
                      Survey: survey,
                      Question: question,
                      QuestionList: questionList,
                      OptionList: optionList,
                      displayName: req.user ? req.user.displayName : "",
                    });
                  }                   
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
    surveyId: req.body.surveyid,
  });

  let newOption = Option({
    questionId: id,
    surveyId: req.body.surveyid,
  })

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
              Option.find({ questionId: id }).exec((err, optionList) => {
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

  let newoption = Option({
    title: req.body.newoption,
    questionId: id,
    surveyId: req.body.surveyid,
  });

  Option.create(newoption, (err, newOption) => {
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
              Question.find({ surveyId: survey._id }).exec((err, questionList) => {
                if (err) {
                  return console.error(err);
                } else {
                  Option.find({ questionId: id }).exec((err, optionList) => {
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
    }
  });
};

module.exports.displayUpdateSurveyPage = (req, res, next) => {
  let id = req.params.id;

  Survey.findById(id, (err, survey) => {
    if (err) {
      return console.error(err);
    } else {
      Question.find({surveyId: id }).exec((err, questionList) => {
        if (err) {
          return console.error(err);
        } else {
          for (let i = 0; i < questionList.length; i++) {
            updateOptionArray.push([]);
          }
          Option.find({surveyId: id}).exec((err, optionList) => {
            if (err) {
              return console.error(err);
            } else {
              for (let count = 0; count < optionList.length; count++) {
                for (let num = 0; num < questionList.length; num++) {
                  if (JSON.stringify(optionList[count].questionId) == JSON.stringify(questionList[num]._id)) {
                    updateOptionArray[num].push(optionList[count]);
                  }
                }
              }
              res.render("surveyAdmin/updateSurvey", {
                title: "Edit Survey",
                Survey: survey,
                QuestionList: questionList,
                TempList: updateOptionArray,
                displayName: req.user ? req.user.displayName : "",
              });
            }
          });
        }
      });
    }
  });
}

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
      res.redirect("/surveys");
    }
  });
};

module.exports.displayUpdateQuestionPage = (req, res, next) => {
  let id = req.params.id;
  updateOptionArray = [];

  Question.findById(id, (err, question) => {
    if (err) {
      return console.error(err);
    } else {
      Survey.findById(question.surveyId, (err, survey) => {
        if (err) {
          return console.error(err);
        } else {
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
  let redirect;

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
              Option.find({ questionId: id }).exec((err, optionList) => {
                if (err) {
                  return console.error(err);
                } else {
                  let k = "req.body.option";
                  let j = "option"
                  let i = 1;
                  redirect = false;
                  for (i = 1; i <= optionList.length; i++)
                  {
                    eval("var " + j + i + " = " + "Option({_id: optionList[" + (i - 1) + "].id, title: " + k + i + ", questionId: id, surveyId: req.body.surveyid, })")                    
                    console.log(eval(j + i))
                  }
                  for (let count = 1; count <= optionList.length; count++)
                  {
                    Option.updateOne({_id: optionList[count - 1].id}, eval(j + count), (err) => {
                      if (err) {
                        return console.error(err);
                      } else {
                        console.log(eval(j + count))
                      }
                    });
                  }
                  res.redirect("/surveys/updateSurvey/" + survey._id)
                }
              });
            }
          });
        }
      });
    }
  });
};

module.exports.processDeleteQuestion = (req, res, next) => {
  let id = req.params.id;

  Question.findById(id, (err, question) => {
    if (err) {
      console.log(err);
      res.end(err);
    } else {
      Survey.findById(question.surveyId, (err, survey) => {
        if (err) {
          console.log(err);
          res.end(err);
        } else {
          Option.remove({questionId: id}, (err) => {
            if (err) {
              console.log(err);
              res.end(err);
            } else {
              Question.remove({_id: id}, (err) => {
                if (err) {
                  console.log(err);
                  res.end(err);
                } else {
                  res.redirect("/surveys/updateSurvey/" + survey._id);
                }
              });
            }
          });
        }
      })
    }
  })
};

module.exports.performDelete = (req, res, next) => {
  let id = req.params.id;

  Option.remove({ surveyId: id }, (err) => {
    if (err) {
      console.log(err);
      res.end(err);
    } else {
      Question.remove({ surveyId: id }, (err) => {
        if (err) {
          console.log(err);
          res.end(err);
        } else {
          Answer.remove({ surveyId: id }, (err) => {
            if (err) {
              console.log(err);
              res.end(err);
            } else { 
              Response.remove({ surveyId: id }, (err) => {
                if (err) {
                  console.log(err);
                  res.end(err);
                } else {
                  Survey.remove({ _id: id }, (err) => {
                    if (err) {
                      console.log(err);
                      res.end(err);
                    } else {
                      res.redirect("/surveys");
                    }
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

module.exports.displayRespondSurveyPage = (req, res, next) => {
  let surveyId = req.params.id;
  let Index = req.params.index;
  let newIndex = parseInt(Index, 10) + 1;

  if (Index == 0) {
    newResponse = Response({
      dateAnswered: new Date().toUTCString(),
      surveyId: surveyId,
    });

      Response.create(newResponse, (err, response) => {
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
              SurveyResponseId:newResponse._id,
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

module.exports.processRespondSurveyPage = (req, res, next) => {
  let surveyId = req.params.id;
  let Index = req.params.index;
  let optionId = req.body.option;
  let newIndex = parseInt(Index, 10) + 1;
  let surveyResponseId = req.body.surveyResponseId;

  Question.find({ surveyId: surveyId }).exec((err, questionList) => {
    if (err) {
      return console.error(err);
    } else {
      if (parseInt(Index, 10) >= 0) {
        let newAnswer = Answer({
          questionId: questionList[Index].id,
          optionId: optionId,
          surveyId: surveyId,
          surveyResponseId: surveyResponseId,
        });

        Answer.create(newAnswer, (err, Answer) => {
          if (err) {
            console.log(err);
          res.end(err);
          } else {
          res.redirect( "" + newIndex);
          }
        });
      }
    }
  });
};

module.exports.displaySurveyStatisticsPage = (req, res, next) => {
  let id = req.params.id;

  Survey.findById(id, (err, survey) => {
    if (err) {
      return console.error(err);
    } else {
      Response.find({surveyId: id}).exec((err, responseList) => {
        if (err) {
          return console.error(err);
        } else {
          Question.find({surveyId: id }).exec((err, questionList) => {
            if (err) {
              return console.error(err);
            } else {
              for (let i = 0; i < questionList.length; i++) {
                updateOptionArray.push([]);
                answerArray.push([]);
              }
              Option.find({surveyId: id}).exec((err, optionList) => {
                if (err) {
                  return console.error(err);
                } else {
                  for (let count = 0; count < optionList.length; count++) {
                    for (let num = 0; num < questionList.length; num++) {
                      if (JSON.stringify(optionList[count].questionId) == JSON.stringify(questionList[num]._id)) {
                        updateOptionArray[num].push(optionList[count]);
                        answerArray[num].push([]);
                      }
                    }
                  }
                  Answer.find({surveyId: id}).exec((err, answerList) => {
                    if (err) {
                      return console.error(err);
                    } else {
                      for (let count = 0; count < answerList.length; count++) {
                        for (let num = 0; num < questionList.length; num++) {
                          for (let i = 0; i < updateOptionArray[num].length; i++) {
                            if (JSON.stringify(answerList[count].optionId) == JSON.stringify(updateOptionArray[num][i]._id)) {
                              answerArray[num][i].push(answerList[count]);
                            }
                          }
                        }
                      }
                      console.log(answerArray)
                      res.render("surveyAdmin/createMCQ", {
                        title: "Survey Statistics",
                        Survey: survey,
                        QuestionList: questionList,
                        TempList: updateOptionArray,
                        ResponseList: responseList,
                        AnswerList: answerArray,
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
    }
  });
}


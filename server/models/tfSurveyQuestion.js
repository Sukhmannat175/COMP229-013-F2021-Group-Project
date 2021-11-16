/*  COMP229-013 F2021
    Group Project Part 2 First Release
    File Name:  models/tfSurveyQuestion.js
    Student#:   
    Name:       
    Date:       
 */

// require modules for the User Model
let mongoose = require("mongoose");
let passportLocalMongoose = require("passport-local-mongoose");

// create a model class
let TFSurveyQuestion = mongoose.Schema(
  {
    Title: String,
    DueDate: Date,
    Description: String,
    Questions: [ { type: String } ]
  },
  {
    collection: "tf_survey_questions",
  }
);

// configure options for User Model
let options = { missingPasswordError: "Wrong / Missing Password" };
User.plugin(passportLocalMongoose, options);

// store model in module.exports container
module.exports.TFSurveyQuestion = mongoose.model("TFSurveyQuestion", TFSurveyQuestion);
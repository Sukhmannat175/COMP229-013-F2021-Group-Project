/*  COMP229-013 F2021
    Group Project Part 2 First Release - Smart Survey
    File Name:   server/models/question.js
    Student#:    301147411, 301182173, 301163120, 301168420, 301182196, 301159644 
    Name:        Marcus Ngooi, Tatsiana Ptushko, Josef Signo, Sukhmannat Singh, Yuko Yamano, Agustin Ignacio Zuluaga
    Description: Model the attributes of the Question to be stored in the database
 */

// require modules for the User Model
let mongoose = require("mongoose");

// create a model class
let Question = mongoose.Schema(
  {
    title: String,
    surveyId: mongoose.Schema.Types.ObjectId
  },
  {
    collection: "questions",
  }
);

// store model in module.exports container
module.exports = mongoose.model("Question", Question);

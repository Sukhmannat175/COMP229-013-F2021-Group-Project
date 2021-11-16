/*  COMP229-013 F2021
    Group Project Part 2 First Release
    File Name:  models/survey.js
    Student#:   
    Name:       
    Date:       
 */

// require modules for the User Model
let mongoose = require("mongoose");

// create a model class
let Survey = mongoose.Schema(
  {
    Title: String,
    DueDate: Date,
    Description: String,
  },
  {
    collection: "surveys",
  }
);

// store model in module.exports container
module.exports = mongoose.model("Survey", Survey);

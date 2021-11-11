/*  COMP229-013 F2021
    Group Project Part 2 First Release
    File Name:  models/contact.js
    Student#:   
    Name:       
    Date:       
 */

// require modules
let mongoose = require("mongoose");

// create a model class
let contactsModel = mongoose.Schema(
  {
    contactName: String,
    contactNumber: String,
    emailAddress: String,
  },
  {
    collection: "contacts",
  }
);

// store model in module.exports container
module.exports = mongoose.model("Contact", contactsModel);

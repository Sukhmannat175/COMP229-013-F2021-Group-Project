/*  COMP229-013 F2021
    Group Project Part 2 First Release - Smart Survey
    File Name:   app.css
    Student#:    301147411, 301182173, 301163120, 301168420, 301182196, 301159644 
    Name:        Marcus Ngooi, Tatsiana Ptushko, Josef Signo, Sukhmannat Singh, Yuko Yamano, Agustin Ignacio Zuluaga
    Description: Model the attributes of the User to be stored in the database 
 */

// require modules for the User Model
let mongoose = require("mongoose");
let passportLocalMongoose = require("passport-local-mongoose");

// create a model class
let User = mongoose.Schema(
  {
    username: {
      type: String,
      default: "",
      trim: true,
      required: "username is required",
    },
    /* 
    password:
    {
        type: String,
        default: "",
        trim: true,
        required: "password is required"
    }
    */
    email: {
      type: String,
      default: "",
      trim: true,
      required: "email address is required",
    },
    displayName: {
      type: String,
      default: "",
      trim: true,
      required: "Display Name is required",
    },
    created: {
      type: Date,
      default: Date.now,
    },
    update: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "users",
  }
);

// configure options for User Model
let options = { missingPasswordError: "Wrong / Missing Password" };
User.plugin(passportLocalMongoose, options);

// store model in module.exports container
module.exports.User = mongoose.model("User", User);

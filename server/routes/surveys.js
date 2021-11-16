/*  COMP229-013 F2021
    Group Project Part 2 First Release
    File Name:  routes/surveys.js
    Student#:   
    Name:       
    Date:       
 */

// require modules for Contact routes
let express = require("express");
let router = express.Router();
let mongoose = require("mongoose");

let passport = require("passport");

let surveysController = require("../controllers/survey");

// helper function for guard purposes
function requireAuth(req, res, next) {
    // check if the user is logged in
    if(!req.isAuthenticated()) {
        return res.redirect("/login");
    }
    next(); // goes to next call
}

// GET Route for the Survey List page - READ operation
router.get("/", surveysController.displaySurveyList);

// GET Route for the Create Survey page - CREATE operation
router.get("/createSurvey", surveysController.displayCreateSurveyPage);

// POST Route for the Create Survey page - CREATE operation
router.post("/createSurvey", surveysController.processCreateSurveyPage);

// GET Route for the Create MCQ Survey page - READ operation
router.get("/createMCQ", surveysController.displayCreateMCQSurveyPage);

/* GET Route for displaying Edit page - UPDATE operation */
router.get("/updateSurvey/:id", surveysController.displayUpdateSurveyPage);

/* POST Route for processing Edit page - UPDATE operation */
router.post("/updateSurvey/:id", surveysController.processUpdateSurveyPage);

/* GET to perform Deletion - DELETE operation */
router.get("/delete/:id", surveysController.performDelete);

module.exports = router;
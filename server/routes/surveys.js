/*  COMP229-013 F2021
    Group Project Part 2 First Release - Smart Survey
    File Name:   server/routes/surveys.js
    Student#:    301147411, 301182173, 301163120, 301168420, 301182196, 301159644 
    Name:        Marcus Ngooi, Tatsiana Ptushko, Josef Signo, Sukhmannat Singh, Yuko Yamano, Agustin Ignacio Zuluaga
    Description: Routing for survey administration
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
router.get("/", requireAuth, surveysController.displaySurveyList);

// GET Route for the Create Survey page - CREATE operation
router.get("/createSurvey", requireAuth, surveysController.displayCreateSurveyPage);

// POST Route for the Create Survey page - CREATE operation
router.post("/createSurvey", surveysController.processCreateSurveyPage);

// GET Route for the Create MCQ Survey page - READ operation
router.get("/createMCQ", surveysController.displayMCQSurveyPage);

//GET Route for the Create TF Survey page - READ Operation
router.get("/createTF", surveysController.displayTFSurveyPage);

/* GET Route for displaying Update Survey page - UPDATE operation */
router.get("/updateSurvey/:id", surveysController.displayUpdateSurveyPage);

/* POST Route for processing Update Survey page - UPDATE operation */
router.post("/updateSurvey/:id", surveysController.processUpdateSurveyPage);

/* GET to perform Deletion - DELETE operation */
router.get("/delete/:id", surveysController.performDelete);

module.exports = router;
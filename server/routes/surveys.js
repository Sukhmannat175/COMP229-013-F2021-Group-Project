/*  COMP229-013 F2021
    Group Project Part 2 Final Release - Smart Survey
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

// GET Route for displaying Create MCQ Survey page - READ operation
router.get("/createMCQ", requireAuth, surveysController.displayMCQSurveyPage);

// POST Route for processing MCQ Survey page - CREATE operation
router.post("/createMCQ", requireAuth, surveysController.processMCQSurveyPage);

// GET Route for displaying Create MCQ Questions page - READ operation
router.get("/addMCQQuestions/:id", requireAuth, surveysController.displayAddMCQQuestions);

// POST Route for processing Create MCQ Questions page - CREATE operation
router.post("/addMCQQuestions/:id", requireAuth, surveysController.processAddMCQQuestions);

// GET Route for displaying Add MCQ Questions page - READ operation
router.get("/addOneMCQQuestion/:id", requireAuth, surveysController.displayOneMCQQuestion);

// POST Route for processing Add MCQ Questions page - CREATE operation
router.post("/addOneMCQQuestion/:id", requireAuth, surveysController.processOneMCQQuestion);

// POST Route for cancelling Add MCQ Questions page - DELETE operation
router.get("/cancelMCQQuestion/:id", requireAuth, surveysController.processCancelMCQQuestion);

// GET Route for displaying Add One MCQ Question page - READ operation
router.get("/addOneMCQQuestion/addOptions/:id", requireAuth, surveysController.displayAddOptions);

// POST Route for processing Add One MCQ Question page - CREATE operation
router.post("/addOneMCQQuestion/addOptions/:id", requireAuth, surveysController.processAddOptions);

// GET Route for displaying Update Survey page - READ operation 
router.get("/updateSurvey/:id", requireAuth, surveysController.displayUpdateSurveyPage);

// POST Route for processing Update Survey page - UPDATE operation 
router.post("/updateSurvey/:id", requireAuth, surveysController.processUpdateSurveyPage);

// GET Route for displaying Update Question page - READ operation
router.get("/updateQuestion/:id", requireAuth, surveysController.displayUpdateQuestionPage);

// POST Route for processing Update Question page - UPDATE operation
router.post("/updateQuestion/:id", requireAuth, surveysController.processUpdateQuestionPage);

// GET to Delete Individual Question - DELETE Operation
router.get("/deleteQuestion/:id", requireAuth, surveysController.processDeleteQuestion);

// GET to perform Deletion - DELETE operation
router.get("/delete/:id", requireAuth, surveysController.performDelete);

// GET Route for the respond Survey page
router.get("/respondSurvey/:id/:index", surveysController.displayRespondSurveyPage);

// POST Route for the respond Survey page
router.post("/respondSurvey/:id/:index", surveysController.processRespondSurveyPage);

// GET Route for Survey Statistics Page
router.get("/surveyStatistics/:id", requireAuth, surveysController.displaySurveyStatisticsPage);

module.exports = router;
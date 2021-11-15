/*  COMP229-013 F2021
    Group Project Part 2 First Release
    File Name:  routes/index.js
    Student#:   
    Name:       
    Date:       
 */

// require modules
let express = require("express");
let router = express.Router();

let indexController = require("../controllers/index");

/* GET home page. */
router.get("/", indexController.displayHomePage);

/* GET home page. */
router.get("/home", indexController.displayHomePage);

/* GET Create Survey page. */
router.get('/createSurvey',indexController.displayCreateSurveyPage);

/* GET Route for displaying the Add Contact page - CREATE operation. */
router.get('/createMCQ', indexController.displayCreateMCQsurveyPage);

/* GET My Surveys page. */
router.get('/mySurveys', indexController.displayMySurveysPage);

/* GET Route for displaying Login page*/
router.get("/login", indexController.displayLoginPage);

/* POST Route for processing Login page*/
router.post("/login", indexController.processLoginPage);

/* GET Route for displaying Register page*/
router.get("/register", indexController.displayRegisterPage);

/* POST Route for processing Register page*/
router.post("/register", indexController.processRegisterPage);

/* GET to perform User Logout*/
router.get("/logout", indexController.performLogout);

module.exports = router;
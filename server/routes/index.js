/*  COMP229-013 F2021
    Group Project Part 2 First Release - Smart Survey
    File Name:   app.css
    Student#:    301147411, 301182173, 301163120, 301168420, 301182196, 301159644 
    Name:        Marcus Ngooi, Tatsiana Ptushko, Josef Signo, Sukhmannat Singh, Yuko Yamano, Agustin Ignacio Zuluaga
    Description: Routing for landing page and login/logout/register
 */

// require modules
let express = require("express");
let router = express.Router();

let indexController = require("../controllers/index");

/* GET home page. */
router.get("/", indexController.displayHomePage);

/* GET home page. */
router.get("/home", indexController.displayHomePage);

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
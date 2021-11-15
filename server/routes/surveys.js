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

let contactController = require("../controllers/survey");

// helper function for guard purposes
function requireAuth(req, res, next) {
    // check if the user is logged in
    if(!req.isAuthenticated()) {
        return res.redirect("/login");
    }
    next(); // goes to next call
}

// GET Route for the Business Contact List page - READ operation
router.get("/", requireAuth, contactController.displayContactList);

/* GET Route for displaying Add page - CREATE operation */
router.get("/add", contactController.displayAddPage);

/* POST Route for processing Add page - CREATE operation */
router.post("/add", contactController.processAddPage);

/* GET Route for displaying Edit page - UPDATE operation */
router.get("/update/:id", contactController.displayUpdatePage);

/* POST Route for processing Edit page - UPDATE operation */
router.post("/update/:id", contactController.processUpdatePage);

/* GET to perform Deletion - DELETE operation */
router.get("/delete/:id", contactController.performDelete);

module.exports = router;
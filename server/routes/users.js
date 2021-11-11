/*  COMP229-013 F2021
    Group Project Part 2 First Release
    File Name:  routes/users.js
    Student#:   
    Name:       
    Date:       
 */

let express = require('express');
let router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;

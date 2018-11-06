var express = require("express");
var router = express.Router();



router.use("/admin",require(__dirname + "/admin.js"));
router.use("/",require(__dirname + "/public.js"));


module.exports = router;
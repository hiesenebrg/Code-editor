const express = require("express");
const router = express.Router();
router.use("/user", require("./user"));
router.use("/socket", require("./socket"));





module.exports = router;
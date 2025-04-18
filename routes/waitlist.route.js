const express = require("express");

const router = express.Router();

const {
  joinWaitList,
  getWaitList,
  deleteWaitList,
} = require("../controllers/waitlist");

router.post("/add-waitlist", joinWaitList);
router.get("/waitlist", getWaitList);
router.delete("/waitlist/:id", deleteWaitList);

module.exports = router;

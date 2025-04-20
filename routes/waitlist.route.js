const express = require("express");

const router = express.Router();

const {
  joinWaitList,
  getWaitList,
  deleteWaitList,
  exportWaitlist,
} = require("../controllers/waitlist");

router.post("/add-waitlist", joinWaitList);
router.get("/waitlist", getWaitList);
router.delete("/waitlist/:id", deleteWaitList);
router.get("/export-waitlist", exportWaitlist);

module.exports = router;

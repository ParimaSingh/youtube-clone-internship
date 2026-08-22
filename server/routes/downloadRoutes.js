
const {
  checkDownloadAuthorization,
  createDownload,
  completeDownload,
  failDownload,
  interruptDownload,
  getUserDownloads,
} = require("../controllers/downloadController");
const express = require("express");


const router = express.Router();
router.get("/user/:userId", getUserDownloads);
router.post("/authorize", checkDownloadAuthorization);

router.post("/", createDownload);

router.post("/complete", completeDownload);
router.post("/fail", failDownload);
router.post("/interrupt", interruptDownload);

module.exports = router;
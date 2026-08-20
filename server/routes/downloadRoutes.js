const express = require("express");

const {
  checkDownloadAuthorization,
  createDownload,
  completeDownload,
failDownload,
interruptDownload,
} = require("../controllers/downloadController");

const router = express.Router();

router.post("/authorize", checkDownloadAuthorization);

router.post("/", createDownload);

router.post("/complete", completeDownload);
router.post("/fail", failDownload);
router.post("/interrupt", interruptDownload);

module.exports = router;
const express = require("express");
const router = express.Router();

const {getAllProfiles, getProfile,analyzeProfile} = require("../controllers/profileController");

router.get("/profiles", getAllProfiles);
router.get("/profiles/:username", getProfile);
router.post("/analyze/:username", analyzeProfile);

module.exports = router;
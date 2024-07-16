const express = require("express");
const jwt = require('jsonwebtoken');

const router = express.Router();
const db = require('../db/conn');

const cookieParser = require("cookie-parser");
router.use(cookieParser()); 




module.exports = router;  
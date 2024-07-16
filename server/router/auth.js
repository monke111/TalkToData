const express = require("express");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs")
const cookieParser = require("cookie-parser");

const router = express.Router();
//DB
require('../db/conn')

router.use(cookieParser());
const authenticate = require('../middleware/authenticate')

const passport = require("passport");

 

// ---------------------------------------------------------------------------------   GOOGLE OAUTH 2     --------------------------------------------------------------------------------------

//signup - strategy
router.get("/auth/google/signup", passport.authenticate("google", ["profile", "email"]));

router.get(
	"/auth/google/signup/callback",
	passport.authenticate("google",{session: false}),
	(req,res) => {
		// successRedirect: process.env.CLIENT_URL,
		// failureRedirect: "/signup/failed",
		const token = req.user.token
		res.cookie("jwtoken", token, { path: '/' },{ expires:new Date(Date.now()+ 25892000),httpOnly: true });
		console.log("Cookie stored");
		console.log("========================");
    	res.redirect(process.env.CLIENT_URL);

	}
);


// -------------------------------------------------------------------------------------    ROUTES     ----------------------------------------------------------------------------------------



module.exports = router;  
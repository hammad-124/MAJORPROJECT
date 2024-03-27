const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapasync = require("../utils/wrapAsync.js");
const passport = require("passport");
const flash = require("connect-flash");
const { savedRedirectUrl } = require("../middleware.js");
const userControllers = require("../controller/user.js");


router.get("/signup",userControllers.getSignForm
)

router.post("/signup",wrapasync(userControllers.postSignForm
));


router.get("/login",userControllers.getLoginForm
);

router.post(
    "/login",
    savedRedirectUrl,
    passport.authenticate('local',{
        failureRedirect:"/login",
        failureFlash:true,
    }),
   userControllers.postLoginForm
);

router.get("/logout",userControllers.logOut);
module.exports = router;
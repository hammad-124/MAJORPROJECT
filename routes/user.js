const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapasync = require("../utils/wrapAsync.js");
const passport = require("passport");
const flash = require("connect-flash");


router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
})

router.post("/signup",wrapasync(async(req,res)=>{

    try{
        let{username,email,password} = req.body;
        const newUser = new User({email,username});
      const registerUser =  await User.register(newUser,password);
      //Automatially loggen in when user sign up..............................
      req.login(registerUser,(err)=>{
        if(err) {
            return  next(err);
          }
          req.flash("sucess","Sucessfully Logged in !");
          res.redirect("/listings");
      })
      
    }
    catch(e){
        req.flash('error',e.message);
        res.redirect("/signup");
    }
    
}));


router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});

router.post(
    "/login"
    ,passport.authenticate('local',{
        failureRedirect:"/login",
        failureFlash:true,
    }),
    async(req,res)=>{
      req.flash("sucess","Welcome to wanderLust! You are Logged in..");
      res.redirect("/listings");
});

router.get("/logout",(req,res,next)=>{
    req.logOut((err)=>{
        if(err) {
          return  next(err);
        }
        req.flash("sucess","Sucessfully LoggedOut !");
        res.redirect("/listings");
    })
})
module.exports = router;
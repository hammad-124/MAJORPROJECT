const User = require("../models/user.js");

module.exports.getSignForm = (req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.postSignForm = async(req,res)=>{

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
      }
      )
      
    }
    catch(e){
        req.flash('error',e.message);
        res.redirect("/signup");
    }
    
}

module.exports.getLoginForm = (req,res)=>{
    res.render("users/login.ejs");
}

module.exports.postLoginForm =  async(req,res)=>{
    req.flash("sucess","Welcome to wanderLust! You are Logged in..");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logOut = (req,res,next)=>{
    req.logOut((err)=>{
        if(err) {
          return  next(err);
        }
        req.flash("sucess","Sucessfully LoggedOut !");
        res.redirect("/listings");
    })
}
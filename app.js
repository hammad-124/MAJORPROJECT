
if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
};

console.log(process.env.SECRET) ;



const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const wrapasync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/expresserror.js");
const {listingSchema,reviewSchema} = require("./schema.js");
const listing = require("./models/listing.js");
const Review = require("./models/review.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const listingRouter= require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.use(express.json());
app.engine('ejs', ejsmate);
app.use(express.static(path.join(__dirname,"/public")));


const mongoose = require("mongoose");
const wrapAsync = require("./utils/wrapAsync.js");
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
  
  };
  main().then(()=>{
    console.log("connect to mongoose")
})
    .catch((err) => console.log(err)
    );




app.listen(8080,()=>{
    console.log("listning sucessfully");
});



const sessionOptions = {
    secret : "mySupersecretcode",
    resave :false,
    saveUninitialized:true,
    cookie : {
        expires :Date.now() + 7*24*60*60*1000,
        maxAge :7*24*60*60*1000,
        httpOnly : true,
    }
};

app.get("/",(req,res)=>{
    res.send("working sucessfully");
});


app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>{
    
    res.locals.sucess = req.flash("sucess");
    res.locals.error =req.flash("error");
    //passport doesnot allow directly acess to ajs but if use locals then its allows......................
    res.locals.currentUser = req.user;
    next();
});

// app.get("/demouser",async (req,res)=>{
//     let fakeUser = new User({
//         email : "newuser@gmail.com",
//         username :"student"
//     });
//     let regiterUser = await User.register(fakeUser,"helloworld");
//     res.send(regiterUser);
// })


app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);


//error for page not found...................................................................

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
})

//error handling middleware to insure the values.................................................
app.use((err,req,res,next)=>{
    let {statusCode = 500, message= "something went wrong!"} = err;
    // res.render("error.ejs",{message});
    res.status(statusCode).render("error.ejs",{message});
});








































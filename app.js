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


const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");


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

app.get("/",(req,res)=>{
    res.send("working sucessfully");
});



app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);

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








































const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const wrapasync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/expresserror.js");
const {listingSchema,reviewSchema} = require("./schema.js");
const listing = require("./models/listing.js");
const Review = require("./models/review.js");


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.use(express.json());
app.engine('ejs', ejsmate);
app.use(express.static(path.join(__dirname,"/public")));


const mongoose = require("mongoose");
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

//validate review from server side..............................................
 const validateReview = (req,res,next)=>{
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400 , errMsg);
    } else {
        next();
    }
 }
//index route.........................................................

app.get("/listings",wrapasync(async (req,res)=>{
    const alllistings = await listing.find({});
    res.render("listings/index.ejs",{alllistings});
    
}));

//Creatiing route.........................................................

app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");

});

app.post("/listings", wrapasync(async (req,res,next)=>{
    
    let result = listingSchema.validate(req.body);
    console.log(result);
  
    const addlisting = new listing( req.body.listing);
    await addlisting.save();
    res.redirect("/listings");
   
}));

//show route.............................................................

app.get("/listings/:id", wrapasync(async (req,res)=>{
    let {id} = req.params;
   const list = await listing.findById(id).populate("reviews");
   res.render("listings/show.ejs",{list});
}));

//edit route...............................................................

app.get("/listings/:id/edit",wrapasync(async (req,res)=>{
    let {id} = req.params;
   const list = await listing.findById(id);
   res.render("listings/edit.ejs",{list});
}));

//update route.................................................................

app.put("/listings/:id", wrapasync(async (req,res)=>{

    
    let {id}=req.params;
    let { image } = req.body.listing;
    let filename ="random";
    let updatedImage = { url: image, filename }; 
    req.body.listing.image = updatedImage; 
    await listing.findByIdAndUpdate(id, req.body.listing);
    res.redirect("/listings");
}));




//DELETE ROUTE.......................................................................
app.delete("/listings/:id",wrapasync( async (req,res)=>{
    let {id} = req.params;
    await listing.findByIdAndDelete(id);
    console.log(listing);
    res.redirect("/listings");
}));

//REVIEW POST..............................................................................
app.post("/listings/:id/reviews",validateReview, wrapasync(async (req, res) => {
    let list = await listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    list.reviews.push(newReview);
    await newReview.save();
    await list.save();
    res.redirect(`/listings/${list._id}`);
    res.send("Review saved");
}));



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








































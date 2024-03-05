const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const wrapasync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/expresserror.js");
const {listingSchema} = require("./schema.js");

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


const listing = require("./models/listing.js");


app.listen(8080,()=>{
    console.log("listning sucessfully");
});

app.get("/",(req,res)=>{
    res.send("working sucessfully");
});

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
    // if(! req.body.listing){
    //     throw new ExpressError(400,"Send Valid Data For Listing");
    // };

    let result = listingSchema.validate(req.body);
    console.log(result);
  
    const addlisting = new listing( req.body.listing);
    // if(!addlisting.title){
    //     throw new ExpressError(400,"Title is missing");

    // };
    // if(!addlisting.description){
    //     throw new ExpressError(400,"Description is missing");

    // };
    // if(!addlisting.location){
    //     throw new ExpressError(400,"Location is missing");

    // }

    // console.log(addlisting);
    await addlisting.save();
    res.redirect("/listings");
   
}));

//show route.............................................................

app.get("/listings/:id", wrapasync(async (req,res)=>{
    let {id} = req.params;
   const list = await listing.findById(id);
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
    res.redirect("/listings");
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





































// app.get("/testlisting",async (req,res)=>{
//    let sampleListing = new listing({
//       title : "my new villa",
//       description : "by the BEACH",
//       price : 1200,
//       location :"Lahore",
//       country : "Pakistan",
//    });

//    await sampleListing.save();
//    console.log("sample is saved");
//    res.send("sucessfully inserted");
// });


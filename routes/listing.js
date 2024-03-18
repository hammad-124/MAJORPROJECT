const express = require("express");
const router = express.Router();


const wrapasync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expresserror.js");
const {listingSchema} = require("../schema.js");
const listing = require("../models/listing.js");

//index route.........................................................

router.get("/",wrapasync(async (req,res)=>{
    const alllistings = await listing.find({});
    res.render("listings/index.ejs",{alllistings});
    
}));

//NEW route.........................................................

router.get("/new",(req,res)=>{
    res.render("listings/new.ejs");

});

//CREATE route...................................................

router.post("/", wrapasync(async (req,res,next)=>{
    
    let result = listingSchema.validate(req.body);
    console.log(result);
  
    const addlisting = new listing( req.body.listing);
    await addlisting.save();
    res.redirect("/listings");
   
}));

//show route.............................................................

router.get("/:id", wrapasync(async (req,res)=>{
    let {id} = req.params;
   const list = await listing.findById(id).populate("reviews");
   res.render("listings/show.ejs",{list});
}));

//edit route...............................................................

router.get("/:id/edit",wrapasync(async (req,res)=>{
    let {id} = req.params;
   const list = await listing.findById(id);
   res.render("listings/edit.ejs",{list});
}));

//update route.................................................................

router.put("/:id", wrapasync(async (req,res)=>{

    
    let {id}=req.params;
    let { image } = req.body.listing;
    let filename ="random";
    let updatedImage = { url: image, filename }; 
    req.body.listing.image = updatedImage; 
    await listing.findByIdAndUpdate(id, req.body.listing);
    res.redirect("/listings");
}));




//DELETE ROUTE.......................................................................
router.delete("/:id",wrapasync( async (req,res)=>{
    let {id} = req.params;
    await listing.findByIdAndDelete(id);
    console.log(listing);
    res.redirect("/listings");
}));


module.exports = router;
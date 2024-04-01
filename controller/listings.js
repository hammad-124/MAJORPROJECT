
const listing = require("../models/listing.js");
const {listingSchema} = require("../schema.js");

//index Route...........

module.exports.index = async (req,res)=>{
    const alllistings = await listing.find({});
    res.render("listings/index.ejs",{alllistings});
    
};
 //new Listing form route.........

module.exports.newRouteForm = (req,res)=>{
    
    res.render("listings/new.ejs");

};



//show Route........................................
module.exports.ShowListing = async (req,res)=>{
    let {id} = req.params;
   const list = await listing.findById(id).populate({
    path :"reviews",
    populate:{
        path :"author",
    },
})
.populate("owner");
   if(!list){
    req.flash("error","Listing you requested for does not exist");
    res.redirect("/listings");

   }
   res.render("listings/show.ejs",{list});
}

//Create new listing....................

module.exports.newListingAdd = async (req,res,next)=>{
    let result = listingSchema.validate(req.body);
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url," ",filename);
  
  
    const addlisting = new listing( req.body.listing);
    addlisting.owner = req.user._id;
    addlisting.image= {url,filename};
    await addlisting.save();
    req.flash("sucess","newlisting saved sucessfully");
    res.redirect("/listings");
   
}

//edit from..................................

module.exports.renderEditForm = async (req,res)=>{
    let {id} = req.params;
   const list = await listing.findById(id);
   if(!list){
    req.flash("error","Listing you requested for does not exist");
    res.redirect("/listings");

   }
  
   res.render("listings/edit.ejs",{list});
}

//update route........................................

module.exports.UpdateListing = async (req,res)=>{

    
    let {id}=req.params;
    let { image } = req.body.listing;
    let filename ="random";
    let updatedImage = { url: image, filename }; 
    req.body.listing.image = updatedImage; 
    await listing.findByIdAndUpdate(id, req.body.listing);
    req.flash("sucess","Listing Updated");

    res.redirect("/listings");
}

//delete route............................................

module.exports.DeleteListing = async (req,res)=>{
    let {id} = req.params;
    await listing.findByIdAndDelete(id);
    req.flash("sucess","Listing Deleted!");
    res.redirect("/listings");
}
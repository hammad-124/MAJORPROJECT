const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsmate);
app.use(express.static(path.join(__dirname,"/public")))

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

app.get("/listings",async (req,res)=>{
    const alllistings = await listing.find({});
    res.render("listings/index.ejs",{alllistings});
    
});

//Creatiing route.........................................................

app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
});

app.post("/listings",async (req,res)=>{
    const addlisting =new listing( req.body.listing);
    await addlisting.save();
    res.redirect("/listings");
});

//show route.............................................................

app.get("/listings/:id",async (req,res)=>{
    let {id} = req.params;
   const list = await listing.findById(id);
   res.render("listings/show.ejs",{list});
});

//edit route...............................................................

app.get("/listings/:id/edit",async (req,res)=>{
    let {id} = req.params;
   const list = await listing.findById(id);
   res.render("listings/edit.ejs",{list});
});

//update route.................................................................
// app.put("/listings/:id",async (req,res)=>{
//     let {id} = req.params;
//     await listing.findByIdAndUpdate(id,{...req.body.listing})
//     res.redirect("/listings");
// });

app.put("/listings/:id", async (req,res)=>{
    let {id}=req.params;
    let url = req.body.listing.image;
    let filename ="random";
    req.body.listing.image = {url,filename};
   await listing.findByIdAndUpdate(id,{...req.body.listing});
   res.redirect("/listings");

});

//DELETE ROUTE.......................................................................
app.delete("/listings/:id", async (req,res)=>{
    let {id} = req.params;
    await listing.findByIdAndDelete(id);
    res.redirect("/listings");
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
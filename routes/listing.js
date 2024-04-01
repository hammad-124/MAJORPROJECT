const express = require("express");
const router = express.Router();



const wrapasync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expresserror.js");
const {listingSchema} = require("../schema.js");
const listing = require("../models/listing.js");
const{isLoggedIn} = require("../middleware.js");
const{isOwner}=require("../middleware.js");


//Controllers......................................................
const listingControllers = require("../controller/listings.js");
//middileware for saving images files...................................
const multer  = require('multer');
const {storage} = require("../cloudconfig.js");
// const upload = multer({ dest: 'uploads/' });
const upload = multer({ storage });

//Router.route ......................same path donot declare once .............

router.route("/")
.get(wrapasync(listingControllers.index))
.post(isLoggedIn,upload.single('listing[image]'), wrapasync(listingControllers.newListingAdd) );



// //index route.........................................................

// router.get("/",wrapasync(listingControllers.index)
// );

//NEW route.........................................................

router.get("/new",isLoggedIn,(listingControllers.newRouteForm)
);

// //CREATE route...................................................

// router.post("/",isLoggedIn, wrapasync(listingControllers.newListingAdd)
// );

//show route.............................................................

router.get("/:id", wrapasync(listingControllers.ShowListing
));

//edit route...............................................................

router.get("/:id/edit",isLoggedIn,isOwner,wrapasync(listingControllers.renderEditForm
));

//update route.................................................................

router.put("/:id", isLoggedIn,isOwner,wrapasync(listingControllers.UpdateListing
));




//DELETE ROUTE.......................................................................
router.delete("/:id",isLoggedIn,isOwner,wrapasync(listingControllers.DeleteListing
));


module.exports = router;
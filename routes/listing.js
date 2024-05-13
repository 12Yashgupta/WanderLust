const express=require("express");
const router=express.Router();
const Listing=require("../models/listing.js")
let User=require("../models/user.js");
let {listingSchema}=require("../schema.js");
let asyncWrap=require("../utils/asyncWrap.js");
let expressError=require("../utils/expressError.js");
let {logedIn,checkListAuthorization}=require("../middleware.js");
const validateListing=(req,res,next)=>{
    let{error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new expressError(400,errMsg);
    }
    else
    next();
};

//index Route
router.get("/",asyncWrap(async (req,res)=>{
    let allListings= await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}));

//new Route
router.get("/new",logedIn,(req,res)=>{
   res.render("listings/new.ejs");
});



//show Route
router.get("/:id",asyncWrap(async (req,res)=>{
    let{id}=req.params;
    let list=await Listing.findById(id).populate("reviews").populate("owner");
    if(!list)
        {
            req.flash("error","Listing you requested ,does not exist");
            res.redirect("/listings");
        }
        
   //    console.log(list);
    res.render("listings/show.ejs",{list});
}));

//create Route
router.post("/",logedIn,validateListing,asyncWrap(async (req,res,next)=>{
   
    if(!req.body.listing){
        throw new expressError(400,"Enter the valid data!");
    }

    let listing = await new Listing(req.body.listing);
    listing.owner=req.user._id;
  //  console.log(req.user);
    await listing.save()
    req.flash("success","New Listings is created");
    res.redirect("/listings");
}));


//Update Route
router.get("/:id/edit",logedIn,checkListAuthorization,asyncWrap(async (req,res,next)=>{
   let{id}=req.params;
   let listing=await Listing.findById(id);
   if(!listing)
    {
        req.flash("error","Listing you requested ,does not exist");
        res.redirect("/listings");
    }
   res.render("listings/edit.ejs",{listing});
}));

router.patch("/:id",logedIn,checkListAuthorization,validateListing,asyncWrap(async (req,res)=>{
        if(!req.body.listing)
        {
            throw new expressError(500,"Please input valid data");
        }
//console.log(listing.owner._id,res.locals.currUser._id);
//console.log(listing);
   await Listing.findByIdAndUpdate(id,{...req.body.listing});
   res.redirect(`/listings/${id}`);
}));
//Delete Route
router.delete("/:id",logedIn,checkListAuthorization,asyncWrap(async (req,res)=>{
    let{id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing deleted!");
    res.redirect("/listings");
 }));

 module.exports=router;
const express=require("express");
const router=express.Router({mergeParams:true});
const Listing=require("../models/listing.js")
let asyncWrap=require("../utils/asyncWrap.js");
let expressError=require("../utils/expressError.js");
let Review=require("../models/review.js");
let {review_Schema}=require("../schema.js");
const validateReview=(req,res,next)=>{
    let{error}=review_Schema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new expressError(400,errMsg);
    }
    else
    next();
};
//Post review route
router.post("/",validateReview,asyncWrap(async (req,res)=>{
    let{id}=req.params;
    let newListing=await Listing.findById(id); 
    let newReview=new Review(req.body.review);
    console.log(newListing,newReview);
    newListing.reviews.push(newReview);
    await newListing.save();
    await newReview.save();
    req.flash("success","Review Added!");
    res.redirect(`/listings/${id}`)
}));

//Delete review route
router.delete("/:reviewId",asyncWrap(async(req,res)=>{
         let{id,reviewId}=req.params;
         console.log(req.params);
         await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
         await Review.findByIdAndDelete(reviewId);
         req.flash("success","Review deleted!");
         res.redirect(`/listings/${id}`);

}));


module.exports=router;
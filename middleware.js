let Listing=require("./models/listing");
module.exports.logedIn=(req,res,next)=>{
    if(!req.isAuthenticated())
        {
            req.session.redirectUrl=req.originalUrl;
            req.flash("error","User must be loged-in !");
            res.redirect("/login")
        }
        next();
};

module.exports.saveredirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
         res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};
module.exports.checkListAuthorization=async (req,res,next)=>{
   
    let listing =await Listing.findById(req.params.id);
    console.log(listing);
    console.log(listing.owner._id);
    console.log(res.locals.currUser);
     if(!listing.owner._id.equals(res.locals.currUser._id)){
      req.flash("error","You are not owner of listings");
      res.redirect(`/listings/${id}`)
     }
 
    next();
};
let Listing=require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
//const mbxClient = require('@mapbox/mapbox-sdk'); 
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index=async (req,res)=>{
    let allListings= await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}

module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");
 };

 module.exports.showRoute=async (req,res)=>{
    let{id}=req.params;
    let list=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    console.log(list);
    if(!list)
        {
            req.flash("error","Listing you requested ,does not exist");
            res.redirect("/listings");
        }
   //    console.log(list);
    res.render("listings/show.ejs",{list});
}

module.exports.createNewListing=async (req,res,next)=>{
   
   let response= await geocodingClient.forwardGeocode({
        query: 'New Delhi, India',
      //  proximity: [-95.4431142, 33.6875431]
         limit:1
      })
      .send()
    //    console.log(response.body.features[0].geometry);
     //  res.send("Added");
    if(!req.body.listing){
        throw new expressError(400,"Enter the valid data!");
    }
      let url=req.file.path;
      let filename=req.file.filename;
     let listing = await new Listing(req.body.listing);
     listing.owner=req.user._id;
     listing.image={url,filename};
     listing.geometry=response.body.features[0].geometry;
    // console.log(req.user);
      
   let new_listing=  await listing.save();
   console.log(new_listing);
     req.flash("success","New Listings is created");
     res.redirect("/listings");
  
};

module.exports.editForm=async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested, does not exist");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
};

module.exports.updateForm=async (req, res) => {
    const { id } = req.params;
    if (!req.body.listing) {
        throw new expressError(500, "Please input valid data");
    }
    
    let listing=await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof req.file !=="undefined")
        {
            listing.image.url=req.file.path;
            listing.image.filename=req.file.filename;
        }
        await listing.save();
        res.redirect(`/listings/${id}`);
};

module.exports.deleteForm=async (req,res)=>{
    let{id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log("Deleted listing",deletedListing);
    req.flash("success","Listing deleted!");
    res.redirect("/listings");
 };
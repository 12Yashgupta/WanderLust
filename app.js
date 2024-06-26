if(process.env.Node_ENV!="production"){
require('dotenv').config()
console.log(process.env.SECRET)
}
const express=require("express");//done
const app=express();//done
const mongoose=require("mongoose");//done
const port=8080;//done
const MONGO_LINK="mongodb://127.0.0.1:27017/WanderLust";//done
const Listing=require("./models/listing.js")
const path=require("path");//done
let ejsMate=require("ejs-mate");//done
var methodOverride = require('method-override')
app.use(methodOverride('_method'))
app.engine("ejs",ejsMate);
//let {listingSchema,review_Schema}=require("./schema.js");
let asyncWrap=require("./utils/asyncWrap.js");
let expressError=require("./utils/expressError.js");
const listingsRouter=require("./routes/listing.js");
const reviewsRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");
const session=require("express-session");
let flash=require("connect-flash");
const passport=require("passport");
const localStrategy=require("passport-local");
const User=require("./models/user.js");
const { allowedNodeEnvironmentFlags } = require("process");
async function main(){
    await mongoose.connect(MONGO_LINK);
 }
main()
.then(()=>{
    console.log("Connected to Db");
})
.catch((err)=>{
    console.log(err);
});

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static(path.join(__dirname,"/public")));

let sessionOptions={
    secret: 'keyboard cat',
   resave: false,
   saveUninitialized: true,
   cookie:{
    expires:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true,
   }
};
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get("/demouser",async (req,res)=>{
    let fakeUser=new User({
         email:"Yash@gmail.com",
        username:"Yash Gupta"
    }) ;
   let newUser=await User.register(fakeUser,"yash1234");
   res.send(newUser);
});
app.get("/",(req,res)=>{
    res.send("You are on root path");
})

//For searching listing
app.get("/listings/search",asyncWrap(async(req,res)=>{
    let listing = await Listing.find({title:req.query.title});
    if(listing.length==0)
    {
        req.flash("error","Place not found!");
        res.redirect("/listings");
    }
    res.redirect(`/listings/${listing[0]._id}`);
}));
//For options
// app.get("/listings/catagory/:option",async(req,res)=>{
//    let{option}=req.params;
//   let allListings=await Listing.find({catagory:`${option}`});
//    res.render("listings/index.ejs",{allListings});
// });
app.use((req,res,next)=>{
    res.locals.message=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
   
    next();
 })
app.use("/listings",listingsRouter);
app.use("/listings/:id/review",reviewsRouter);
app.use("/",userRouter);

 app.all("*",(req,res,next)=>{
    res.status(403).send("Page not found!");
 })

 app.use((err,req,res,next)=>{
    let{status=500,message}=err;
    res.status(status).render("alert.ejs",{message});
  //  res.send("Something went wrong!");
 });
 app.listen(port,()=>{
    console.log("App listening on port 8080");
});

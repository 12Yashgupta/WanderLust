const express=require("express");
const router=express.Router();
let asyncWrap=require("../utils/asyncWrap.js");
let expressError=require("../utils/expressError.js");
const User=require("../models/user.js");
const passport=require("passport");
const{saveredirectUrl}=require("../middleware.js");
router.get("/signup",(req,res)=>{
   res.render("users/signup.ejs");
});
router.post("/signup",asyncWrap(async(req,res,next)=>{
   try{
   let{username,email,password}=req.body;
   let newUser=new User({email,username});
   let user=await User.register(newUser,password);
   req.login(user,(err)=>{
      if(err)
      return next(err);
      req.flash("success","Welcome to WanderLust")
      res.redirect("/listings");
   })
   }
   catch(err){
      req.flash("error",err.message);
      res.redirect("/signup");
   }
}));

router.get("/login",(req,res)=>{
   res.render("users/login");
});

router.post("/login",saveredirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),async(req,res)=>{    
    console.log(req.path,"..",req.originalUrl);
    req.flash("success","Welcome back to WanderLust");
    let redirectUrl=res.locals.redirectUrl||"/listings";
    res.redirect(redirectUrl);
});

router.get("/logout",(req,res)=>{
   req.logOut((err)=>{
      if(err)
      next(err);

   req.flash("error","You are loged-out successfully");
   res.redirect("/listings");  
  })
});
module.exports=router;
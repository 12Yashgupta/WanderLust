const express=require("express");
const router=express.Router();
let asyncWrap=require("../utils/asyncWrap.js");
let expressError=require("../utils/expressError.js");
const User=require("../models/user.js");
const passport=require("passport");
const{saveredirectUrl}=require("../middleware.js");
let userController=require("../controllers/users.js");
router.route("/signup")
.get(userController.renderSignupForm)
.post(asyncWrap(userController.signup));


router.route("/login")
.get(userController.renderLoginForm)
.post(saveredirectUrl
   ,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true})
   ,userController.login);

router.get("/logout",userController.logout);
router.get("/profile",(req,res)=>{
      console.log(req.user.Booking);
      res.render("users/profile.ejs");
});
module.exports=router;
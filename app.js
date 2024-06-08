if(process.env.Node_ENV!="production"){
require('dotenv').config()
console.log(process.env.SECRET)
}
const Razorpay = require('razorpay'); 
const { RAZORPAY_ID_KEY, RAZORPAY_SECRET_KEY } = process.env;

const express=require("express");//done
const app=express();//done
const mongoose=require("mongoose");//done
const port=8080;//done
const MONGO_LINK="mongodb://127.0.0.1:27017/WanderLust";//done
const Listing=require("./models/listing.js")
let Booking=require("./models/booking.js")
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
 //var http=require("http").Server(app);
//const paymentRoute=require("./routes/paymentRoute.js");



const session=require("express-session");
let flash=require("connect-flash");
const passport=require("passport");
const localStrategy=require("passport-local");
const User=require("./models/user.js");
const { allowedNodeEnvironmentFlags } = require("process");
let {logedIn,checkListAuthorization}=require("./middleware.js");
const { number } = require('joi');
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


// app.get("/demouser",async (req,res)=>{
//     let fakeUser=new User({
//          email:"Yash@gmail.com",
//         username:"Yash Gupta"
//     }) ;
//    let newUser=await User.register(fakeUser,"yash1234");
//    console.log(req.user);
//    res.send(newUser);
// });


app.get("/",(req,res)=>{
    res.send("You are on root path");
})

//Profie

//For searching listing
app.get("/listings/search",asyncWrap(async(req,res)=>{
    let listing = await Listing.find({title:req.query.title});
    console.log(listing);
    if(listing.length==0)
    {
        req.flash("error","Place not found!");
        res.redirect("/listings");
    }
   
    res.redirect(`/listings/${listing[0]._id}`);
}));

//for booking
app.get("/listings/:id/booking",logedIn,async(req,res,next)=>{
    try{
        let userid=req.user.id;
        let{id}=req.params;
    //    console.log(id);
        let hotelList=await Listing.findById(id);//listing id
        let hotelUser=await User.findById(userid);//user id
        console.log(req.query);

         let booking={
            start:req.query.booking.start,
            end:req.query.booking.end,
            guest:req.query.booking.guest,
            owner:userid,
            place:id
         };
         let newBook=new Booking(booking);
         await newBook.save();
         hotelList.bookings.push(newBook._id);
         hotelUser.bookings.push(newBook._id);
         await hotelList.save();
         await hotelUser.save();
         console.log(newBook);
         console.log(hotelList);
         console.log(hotelUser);
        // hotelList.Booking.push(req.query.booking);
        // hotelUser.Booking.push(req.query.booking);
        // await hotelList.save();
        // await hotelUser.save();
        // console.log(hotelList);
        // console.log(hotelUser);
      
      //  console.log(hotelList);
      //  console.log(req.user);
       // console.log(req.query.booking)
        console.log(hotelList);
   let checkin=req.query.booking.start;
   let checkout=req.query.booking.end;
   let guest=req.query.booking.guest;
   
     let date1=new Date(checkin);
     let date2=new Date(checkout); 
    
    let time_difference = date2.getTime() - date1.getTime();    
    let days_difference = time_difference / (1000 * 60 * 60 * 24); 
    if(days_difference<0){
        req.flash("error","Please enter the valid date");
        res.redirect(`/listings/${id}`)
    }
   
    if(guest<=0 || guest>16)
        {
            req.flash("error","Please enter the guest between 1 to 16");
            res.redirect(`/listings/${id}`)
        }
    let total_price=days_difference*guest;
   //console.log(total_price);
  
   var today =new Date();
   var dd = String(today.getDate());
   var mm=String(today.getDay());
   var yy=String(today.getFullYear());
   var curr_date=dd+"/"+mm+"/"+yy;
   let list_name=hotelList.title;
   let list_price=hotelList.price;
//   console.log(list_price);
  res.send("Booked");
  //  res.render("payment/product.ejs",{curr_date,days_difference,guest,list_name,list_price});
}
catch(err){
       next(err);
}
});

//Payment

const razorpayInstance = new Razorpay({
    key_id: RAZORPAY_ID_KEY,
    key_secret: RAZORPAY_SECRET_KEY
});

const renderProductPage = async(req,res)=>{

    try {
        
        res.render('payment/product');

    } catch (error) {
        console.log(error.message);
    }

}

const createOrder = async(req,res)=>{
    try {
        const amount = req.body.amount*100
        const options = {
            amount: amount,
            currency: 'INR',
            receipt: 'razorUser@gmail.com'
        }
        // console.log(currUser);
        console.log(req.user);
        let{username,email,_id:id}=req.user;
        console.log(username,email,id);
        razorpayInstance.orders.create(options, 
            (err, order)=>{
                if(!err){
                    res.status(200).send({
                        success:true,
                        msg:'Order Created',
                        order_id:order.id,
                        amount:amount,
                        key_id:RAZORPAY_ID_KEY,
                        product_name:req.body.name,
                        description:req.body.description,
                        contact:"",
                        name: `${username}`,
                        email:`${email}`
                    });
                }
                else{
                    res.status(400).send({success:false,msg:'Something went wrong!'});
                }
            }
        );
        // res.redirect("/listings");

    } catch (error) {
        console.log(error.message);
    }
}
app.get('/book', renderProductPage);
app.post('/createOrder',createOrder);




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

//app.use("/",paymentRoute);

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

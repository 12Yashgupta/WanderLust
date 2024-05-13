let express=require("express");
let cookieParser=require("cookie-parser");
let app=express();
let port=3000;
let express_session=require("express-session");
let flash=require("connect-flash");
let sessionOption={secret:"mysecretcode",resave:false,saveUninitialized:true};
const path=require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express_session(sessionOption));
app.use(flash());
// app.use(cookieParser("secretcode"));
// app.get("/getCookie",(req,res)=>{
//     res.cookie("Name","Yash Gupta");
//     res.cookie("Country","India");
//     res.send("Get request sent!");
// });
// app.get("/getSignCookie",(req,res)=>{
//    res.cookie("loves","Sneha",{signed:true});
//    res.send("All cookies");
// });
// app.get("/verify",(req,res)=>{
//      console.log(req.signedCookies);
//      console.log(req.cookies);
//      res.send("Verify!");
// });
// app.get("/",(req,res)=>{
//     console.log(req.cookies);
//     res.send("All cookie is here!");
// });
app.get("/getSession",(req,res)=>{
    if(req.session.count)
        req.session.count++;
    else
       req.session.count=1;
    res.send(`Request is sent! ${req.session.count}`);
})
app.get("/register",(req,res)=>{
    console.log(req.session);
   let{name}=req.query;
   req.session.name=name;
     req.flash("success","User registerred sucessfully!");
     res.send(`Hello This is register option! ${req.session.name}`);
})
app.get("/getName",(req,res)=>{
    
    //res.send(`Hello ,this is ${req.session.name}`);
    res.locals.message=req.flash("success");
    res.render("show.ejs",{name:req.session.name});
})
app.listen(port,()=>{
     console.log("App listening on port 3000");
});
const mongoose=require("mongoose");
const initdata=require("./data.js");

const MONGO_LINK="mongodb://127.0.0.1:27017/WanderLust";
const Listing=require("../models/listing.js");

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

const initDB=async ()=>{
    await Listing.deleteMany({});
    initdata.data= initdata.data.map((obj)=>({...obj,owner:"664068ecda93be89ca783898"}));
    await Listing.insertMany(initdata.data);
    console.log("Data was initialized");
}

initDB();
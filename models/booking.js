const mongoose=require("mongoose");
const schema=mongoose.Schema;
let User=require("./user.js");
let Listing=require("./listing.js");

let bookingSchema=new schema({
    start:{
        type:Date
    },
    end:{
        type:Date
    },
    guest:Number,
    price:Number,
    owner:{
        type:schema.Types.ObjectId,
        ref:"User"
    },
    place:{
            type:schema.Types.ObjectId,
            ref:"Listing"
    }
});
let Booking=mongoose.model("Booking",bookingSchema);
module.exports=Booking;
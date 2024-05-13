const mongoose=require("mongoose");
const schema=mongoose.Schema;
let reviewSchema=new schema({
    comment:String,
    rating:{
        type:String,
        min:1,
        max:5
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
});
let Review=mongoose.model("Review",reviewSchema);
module.exports=Review;
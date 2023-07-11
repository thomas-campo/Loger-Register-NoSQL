import mongoose from "mongoose";

const collection = "Users";

const schema = new mongoose.Schema({
    first_name:String,
    last_name:String,
    email:String,
    password:String,
    cart:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'carts'
    },
    role:{
        type:String,
        default:"user"
    }
},{timestamps:true});

// schema.pre('findOne', function(next){
//     this.populate('carts._id')
//     next()
// })

const userModel = mongoose.model(collection,schema);
export default userModel;
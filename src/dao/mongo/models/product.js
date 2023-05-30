import mongoose from "mongoose";

const collection = "products";

const schema = new mongoose.Schema({
    title:String,
	description:String,
	price:Number,
	category:String,
	thumbnail:String,
	code:Number,
	stock:{
        type:Number,
        default:100
    },
	status:{
        type:Boolean,
        default:'true'
    }
},{timestamps: { createdAt: 'created_at', updateAt: 'updated_at' }}
);

const productModel = mongoose.model(collection,schema);
export default productModel;
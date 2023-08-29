import userModel from "../models/user.js";

export default class UserManager{
    createUser=(user)=>{
        return userModel.create(user);
    }

    createCart = async (cart) => {
        try {
            const { uid, cid } = cart;
            // const user = await this.getUserById(uid);
            const userUpdate = await this.updateUser(uid,{ cart: cid })
            // user.cart.push(cid);
            // await user.save();
            return userUpdate;
        } catch (error) {
            return error
        }
    }

    getUsers=()=>{
        return userModel.find().lean();
    }

    getUserByEmail=(email)=>{
        return userModel.findOne({email}).lean();
    }

    getUserBy = (params) =>{
        return userModel.findOne(params).lean();
    }

    getUserById=(id)=>{
        return userModel.findOne({ _id: id }).lean();
    }

    updatePassword=(email,newHasedPassword)=>{
        return userModel.updateOne({email},{$set:{password:newHasedPassword}}).lean();
    }

    updateCartInUser=(id,cid)=>{
        return userModel.findByIdAndUpdate( id ,{ cart:cid }).lean();
    }

    updateUser = (id, user) => {
        return userModel.findByIdAndUpdate(id, { $set: cart }).lean();
    }
}

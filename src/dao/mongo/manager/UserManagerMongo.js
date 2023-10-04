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
        return userModel.findOne(params);
    }

    getUserById=(id)=>{
        return userModel.findOne({ _id: id }).lean();
    }

    updatePassword=(email,newHasedPassword)=>{
        return userModel.updateOne({email},{$set:{password:newHasedPassword}}).lean();
    }

    updatePasswordById=(id,newHasedPassword)=>{
        return userModel.findByIdAndUpdate(id,{$set:{password:newHasedPassword}}).lean();
    }

    updateCartInUser=(id,cid)=>{
        return userModel.findByIdAndUpdate( id ,{ cart:cid }).lean();
    }

    updateUser = (id, role) => {
        return userModel.findByIdAndUpdate(id, { role:role });
    }

    deleteUser = (id)=>{
        return userModel.findByIdAndDelete(id).lean();
    }
}

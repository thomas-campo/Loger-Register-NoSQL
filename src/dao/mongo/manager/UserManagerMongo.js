import userModel from "../models/user.js";

export default class UserManager{
    createUser=(user)=>{
        return userModel.create(user);
    }

    getUsers=()=>{
        return userModel.find().lean();
    }

    getUserByEmail=(email)=>{
        return userModel.findOne({email});
    }

    getUserById=(id)=>{//trae los productos del carrito, buscando por el id del carrito
        return userModel.findOne({ _id: id }).lean()
    }

    updatePassword=(email,newHasedPassword)=>{
        return userModel.updateOne({email},{$set:{password:newHasedPassword}});
    }
}

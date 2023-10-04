import { CartService, UserService } from "../services/service.js";

const changeRole = async(req,res) =>{
    try{
        const { uid } = req.params;

        if(!uid) return res.status(400).send({status:"error",error:"Falta el id del usuario"})
        const user = await UserService.getUserById(uid);

        if(user.role==="premium"){
            await UserService.updateUser(uid,"user");
            return res.sendStatus(200);
        }
        if(user.role==="user"){
            await UserService.updateUser(uid,"premium");
            return res.sendStatus(200);
        }
        return res.status(400).send({status:"error",error:"Solo se puede cambiar el rol a usuario o a premium"})
    }catch(error){
        console.log(error);
        res.status(500).send({error:error});
    }
}

const getUsers = async(req,res) =>{
    try{
        const user = req.session.user;
        if(!user) return res.render("noAuth")
        if(user.role!=="admin") return res.render("noAuth")
        const users = await UserService.getUsers();
        res.status(200).send({payload:users});
    }catch(error){
        console.log(error);
        res.status(500).send({error:error});
    }
}

const deleteUser = async(req,res)=>{
    try{
        if(!req.session.user) return res.sendStatus(400);
        const user = req.session.user;
        if(user.role !== "admin") return res.sendStatus(401);
        const { uid } = req.params;
        const deleteUser = await UserService.deleteUser(uid);
        if(!deleteUser) return res.status(404).send({message:"error al intentar eliminar el usuario"});
        const cart = deleteUser.cart[0];
        if(cart) await CartService.deleteCart(cart)
        res.status(200);
    }catch(error){
        console.log(error)
        res.status(500).send({error:error})
    }
}

export default {
    changeRole,
    getUsers,
    deleteUser
}
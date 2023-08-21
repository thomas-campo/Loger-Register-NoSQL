import { UserService } from "../services/service.js";

const changeRole = async(req,res) =>{
    try{
        const { uid } = req.params;

        if(!uid) return res.status(400).send({status:"error",error:"Falta el id del usuario"})
        const user = await UserService.getUserByIdService(uid);
        console.log(user);
        if(user.role==="premium"){
            await UserService.update(uid,{role:"user"});
            return res.sendStatus(200);
        }
        if(user.role==="user"){
            await UserService.update(uid,{role:"premium"});
            return res.sendStatus(200);
        }
        return res.status(400).send({status:"error",error:"Solo se puede cambiar el rol a usuario o a premium"})
    }catch(error){
        console.log(error);
        res.status(500).send({error:error});
    }
}

export default {
    changeRole
}
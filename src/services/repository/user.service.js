export default class UserRepository{
    constructor(dao){
        this.dao = dao;
    }
    createUser = (user) => {
        return this.dao.createUser(user)
    }
    createCart = (cart) => {
        return this.dao.createCart(cart)
    }
    getUsers = () => {
        return this.dao.getUsers()
    }
    getUserByEmail = (email) => {
        return this.dao.getUserByEmail(email);
    }
    getUserBy = (params) =>{
        return this.dao.getUserBy(params)
    }
    getUserById = (id) => {
        return this.dao.getUserById(id)
    }
    updatePassword = (email,newHasedPassword) => {
        return this.dao.updatePassword(email,newHasedPassword)
    }
    updatePasswordById = (id,newHasedPassword) =>{
        return this.dao.updatePasswordById(id,newHasedPassword)
    }
    updateCartInUser = (id,cid) =>{
        return this.dao.updateCartInUser( id , cid );
    }
    updateUser = (id,user) =>{
        return this.dao.updateUser(id,user);
    }
    deleteUser = (id)=>{
        return this.dao.deleteUser(id);
    }
}
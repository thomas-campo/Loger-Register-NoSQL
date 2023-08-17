export default class UserRepository{
    constructor(dao){
        this.dao = dao;
    }
    createUserService = (user) => {
        return this.dao.createUser(user)
    }
    createCartService = (cart) => {
        return this.dao.createCart(cart)
    }
    getUsersService = () => {
        return this.dao.getUsers()
    }
    getUserByEmailService = (email) => {
        return this.dao.getUserByEmail(email)
    }
    getUserByService = (params) =>{
        return this.dao.getUserBy(params)
    }
    getUserByIdService = (id) => {
        return this.dao.getUserById(id)
    }
    updatePasswordService = (email,newHasedPassword) => {
        return this.dao.updatePassword(email,newHasedPassword)
    }
    update = (id,user) =>{
        return this.dao.updateUser(id,user);
    }
}
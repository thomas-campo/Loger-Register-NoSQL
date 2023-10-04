export default class DtoUserFront {
    constructor(user){
        this.name = `${user.first_name} ${user.last_name}`
        this.email = user.email
        this.cart = user.cart || []
        this.role = user.role || 'user'
        this.id = user.id
    }
}
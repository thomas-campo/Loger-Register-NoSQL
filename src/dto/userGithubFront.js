export default class DtoUserGithubFront {
    constructor(user){
        this.name = user.name
        this.email = user.email
        this.cart = user.cart || []
        this.role = user.role || 'user'
        this.id = user.id
    }
}
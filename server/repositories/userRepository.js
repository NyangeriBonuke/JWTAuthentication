const User = require('../models/userModel')

class UserRepository{
    async findByEmail(email){
        return User.findOne({email})
    }

    async findByName(userName){
        return User.findOne({userName})
    }

    async createUser(userData){
        return User.create(userData)
    }
}

module.exports = new UserRepository
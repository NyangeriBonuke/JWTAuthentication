const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dontenv').config()
const User = require('../models/userModel')
const UserRepository = require('../repositories/userRepository')
const { access } = require('fs')

class UserUseCase{
    async signupUser(userName, email, password){
        try{
            const hashedPassword = await bcrypt.hash(password, 10)
            const newUser = {userName, email, password: hashedPassword}
            const savedUser = await UserRepository.createUser(newUser)
            const accessToken = jwt.sign({"username": savedUser.userName}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '30s'})
            const refreshToken = jwt.sing({"username": savedUser.userName}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '1d'})
            return {accessToken, refreshToken}

        }catch(error){
            throw new Error(`Usecase error while trying to signup user ${error}`)
        }
    }

    async loginUser(email, password){
        try{

        }
        catch(error){
            throw new Error(`Usecase error while trying to login user ${error}`)
        }
    }
}

module.exports = new UserUseCase
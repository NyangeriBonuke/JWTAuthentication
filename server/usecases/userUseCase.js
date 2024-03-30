const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dontenv').config()
const User = require('../models/userModel')
const UserRepository = require('../repositories/userRepository')

class UserUseCase{
    async signupUser(userName, email, password){
        try{
            const hashedPassword = await bcrypt.hash(password, 10)
            const newUser = {userName, email, password: hashedPassword}
            await UserRepository.createUser(newUser)
            const accessToken = jwt.sign({"userInfo": {"userName": userName, "roles": roles}}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '30s'})
            return accessToken

        }catch(error){
            throw new Error(`Usecase error while trying to signup user ${error}`)
        }
    }

    async loginUser(userName, roles){
        try{
            const accessToken = jwt.sign({"userInfo": {"userName": userName, "roles": roles}}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '30s'})
            return accessToken
        }
        catch(error){
            throw new Error(`Usecase error while trying to login user ${error}`)
        }
    }

    async refreshToken(cookies){
        const refreshToken = cookies.jwt
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            asyncHandler(async(err, decoded) => {
                if (err) throw new Error('Forbidden')
                const foundUser = await UserRepository.findByName(decoded.userName)
                if(!foundUser) throw new Error('Unauthorized user')
                const accessToken = jwt.sign({"userInfo": {"userName": foundUser.userName, "roles": foundUser.roles}}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '10s'})
                return accessToken
            })
        )
    }
}

module.exports = new UserUseCase
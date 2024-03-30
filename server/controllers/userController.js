const UserUseCase = require('../usecases/userUseCase')
const UserRepository = require('../repositories/userRepository')
const bcrypt = require('bcrypt')

class UserController{
    async signupUser(req, res){
        try{
            const {userName, email, password} = req.body
            const existingUserName = await UserRepository.findByName(userName)
            if(existingUserName){
                return res.status(400).json('User already exists')
            }
            const userToken = await UserUseCase.signupUser(userName, email, password)
            return res.status(200).json(userToken)
        }
        catch(error){
            return res.status(400).json(`Controller error while singing up the user ${error}`)
        }
    }

    async loginUser(req, res){
        try{
            const {email, password} = req.body
            const existingUser = await UserRepository.findByEmail(email)
            if(!existingUser){
                return res.status(400).json('Wrong credentials')
            }

            const compare = await bcrypt.compare(password, existingUser.password)
            if(!compare){
                return res.status(400).json(`Wrong credentials`)
            }

            const userToken = await UserUseCase.signupUser(existingUser.userName, existingUser.roles)
            return res.status(200).json(userToken)
        }
        catch(error){
            return res.status(400).json(`Controller error while trying to login in user ${error}`)
        }
    }

    async tokenRefresh(req, res){
        try{
            const cookies = req.cookies
            if(!cookies?.jwt){
                return res.status(401).json({message: 'Unauthorised user'})
            }
            const refreshToken = await UserUseCase.refreshToken(cookies)
            return res.json(refreshToken)
        }
        catch(error){
            return res.status(400).json(`Controller error in refreshing cookies`)
        }
    }

    async logout(req, res){
        try{
            const cookies = req.cookies
            if(!cookies) return res.status(204)
            res.clearCookie('jwt', { htttpOnly: true, sameSite: 'None', secure: true})
            res.json({message: 'Cookie Cleared'})
        }
        catch(error){
            return res.status(400).json('Controller logout error')
        }
    }
}

module.exports = new UserController
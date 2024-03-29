const UserUseCase = require('../usecases/userUseCase')
const UserRepository = require('../repositories/userRepository')

class UserController{
    async signupUser(req, res){
        try{
            const {userName, email, password} = req.body
            const existingUserName = await UserRepository.findByName(userName)
            if(existingUserName){
                return res.status(400).json('User already exists')
            }
            const newUser = await UserUseCase.signupUser(userName, email, password)
            return res.status(200).json(newUser)
        }
        catch(error){
            res.status(400).json(`Controller error while singing up the user ${error}`)
        }
    }
}

module.exports = new UserController
const User      = require('../database').User
const Customer  = require('./customer')
const Shop      = require('./shop')

module.exports = {
  authenticateAccount: async function(_username, _password) {
    try {
      const user = await User.findOne({where: { 
        username: _username,
        password: _password
      }}, {raw: true})
      if (user != undefined)      
        return Promise.resolve(user.userId)
      else 
        return null
    } catch (error) {
      return Promise.reject(error)
    }
  },

  insertNewUser: async function(_username, _password, _userType) {    
    // console.log(_userType)
    if (_userType != 'Shop' && _userType != 'Customer')
      return Promise.reject(new Error('UserType is not allowed'))

    try {      
      const existedUser = await User.findOne({where: {
        username: _username
      }}, {raw: true})
    
      if (existedUser != undefined) return Promise.reject(new Error('Existed username'))

      const newUser = await User.create({
        username: _username, password: _password, userType: _userType
      }, {raw: true})
      
      if (_userType == 'Shop') 
        Shop.insert(newUser.userId)
      else        
        Customer.insert(newUser.userId)

      return Promise.resolve(newUser.userId)
    } catch (error) {
      return Promise.reject(error)
    }
  },
  
  getInfo: async function(userId) {
    try {
      let user = await User.findById(userId, {raw:true})            
      let info = (user.userType == 'Shop') ? await Shop.getInfo(userId) 
                                            : await Customer.getInfo(userId)      
      for (var key in info) user[key] = info[key]
      return Promise.resolve(user)
    } catch (error) {
      return Promise.reject(error)
    }
  }
}  
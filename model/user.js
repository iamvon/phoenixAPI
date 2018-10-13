const User        = require('../database').User
const Shop        = require('../database').Shop
const Customer    = require('../database').Customer

// const Customer  = require('./customer')
// const Shop      = require('./shop')

module.exports = {
  authenticateAccount: async function(_username, _password) {
    try {
      const user = await User.findOne({where: { 
        username: _username,
        password: _password
      }}, {raw: true})
      if (user == undefined) return Promise.reject(new Error('Invalid username or password'))
      const info = await this.getInfo(user.userId)

      return Promise.resolve({
        token: user.userId,
        info: info
      })
    } catch (error) {
      return Promise.reject(error)
    }    
  },

  insertNewUser: async function(_username, _password, _userType) {        
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
        Shop.create({shopId: newUser.userId})        
      else        
        Customer.create({customerId: newUser.userId})        

      return Promise.resolve(newUser.userId)
    } catch (error) {
      return Promise.reject(error)
    }
  },
  
  getById: async function(_userId) {            
    try {      
      var user = await User.findById(_userId, {raw:true})                  
      if (user == undefined) return Promise.reject(new Error('Invalid userId'))
      return Promise.resolve(user)
    } catch (error) {
      return Promise.reject(error)
    }
  },

  getInfo: async function(_userId) {    
    try {
      let user = await User.findById(_userId, {raw:true})            
      let info = {}
      if (user.userType == 'Shop')
        info = Shop.findById(_userId, {raw: true})
      else 
        info = Customer.findById(_userId, {raw: true})
      for (var key in info) user[key] = info[key]
      return Promise.resolve(user)
    } catch (error) {
      return Promise.reject(error)
    }
  }
}  
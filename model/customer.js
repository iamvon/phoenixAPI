const User        = require('../database').User
const Customer    = require('../database').Customer
const Shop        = require('./shop')
const Voucher     = require('./voucher')
const CustomerSM  = require('../smart-contract/consumer') 
const CustomerSMI = require('../smart-contract/consumerInfinito')


module.exports = {
  insert: async function (id) {
    return Customer.create({customerId: id})
  },

  getInfo: async function(id) {
    return Customer.findById(id, {raw:true})
  },

  cashOut: async function(_customerId, _shopId) {
    try {
      let [shop, Wallet] = await Promise.all([
        Shop.getInfo(_shopId),
        this.getWallet(_customerId)
      ])    
      if (shop == null) return Promise.reject(new Error(`Shop doesn't exist`))      
      Wallet = Wallet.filter(x => x.pointID == shop.PointID)
      
      if (Wallet.length != 1 || Wallet[0].currentAmount < shop.pointNeedToCashout) 
        return Promise.reject(new Error('Not enough money to cash out'))

      const result = await Voucher.create(_customerId, _shopId, shop.discount)
      return Promise.resolve(result)
    } catch (error) {
      return Promise.reject(new Error(error))
    }
  },

  useVoucher: async function(_customerId, _code) {
    try {
      const _condition = {
        ownerId: _customerId,
        code: _code
      }
      let [voucher, Wallet] = await Voucher.findOneCondition(_condition)      
      if (voucher == undefined || voucher.status != 'available')
        return Promise.reject(new Error('Invalid Voucher Code'))
      
      await voucher.update({status: 'used'})      
      return Promise.resolve('success')
    } catch (error) {
      return Promise.reject(new Error(error))
    }
  },

  getOwningVoucher: async function(userId) {
    try {      
      const _condition = {ownerId: userId}
      const result = await Voucher.findAllCondition(_condition)
      return Promise.resolve(result)
    } catch (error) {
      return Promise.reject(error)   
    }
  },

  getWallet: async function(userId) {
    try {
      const user = await User.findById(userId)      
      const Wallet = await CustomerSM.customerWallet(user.PublicAddress)
      return Promise.resolve(Wallet)
    } catch (error) {
      return Promise.reject(error)
    }    
  },

  getPotentialVoucher: async function(_customerId) {
    try {
      const Wallet = await this.getWallet(_customerId)      
      let Points = await Wallet.map(x => x.pointID)      
      const shops = await Shop.getAllCondition({})      
      let result = []
      for (let shop of shops) {
        let include = false
        for (let p of Points) if (p == shop.PointID) include = true
        if (true) result.push(shop)
      }      
      return Promise.resolve(result)
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
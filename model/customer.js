const Customer    = require('../database').Customer
const Shop        = require('./shop')
const Voucher     = require('./voucher')

module.exports = {
  insert: async function (id) {
    return Customer.create({customerId: id})
  },

  getInfo: async function(id) {
    return Customer.findById(id, {raw:true})
  },

  createVoucher: async function(customerId, shopId) {
    try {
      const shop = await Shop.getInfo(shopId)
      if (shop == null) return Promise.reject(new Error(`Shop doesn't exist`))      
      const result = await Voucher.create(customerId, shopId, shop.discount)
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
      let voucher = await Voucher.findOneCondition(_condition)
      // console.log(voucher)
      await voucher.update({status: 'used'})
      // return Promise.resolve(voucher.voucherId)
      return Promise.resolve('success')
    } catch (error) {
      return Promise.reject(new Error(error))
    }
  }
}
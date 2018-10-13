const Voucher       = require('../database').Voucher
const randomstring  = require('randomstring') 

module.exports = {
  create: async function(_ownerId, _shopId, _discount) {    
    try {
      const voucher = await Voucher.create({
        ownerId: _ownerId,
        shopId: _shopId,
        discount: _discount,
        code: randomstring.generate(30)
      })
      return Promise.resolve(voucher.voucherId)
    } catch (error) {
      return Promise.reject(error)
    } 
  },

  findOneCondition: async function(_condition) {
    try {
      const voucher = await Voucher.findOne({where: _condition},{raw: true})
      return Promise.resolve(voucher)
    } catch (error) {
      return Promise.reject(error)
    }
  },

  findAllCondition: async function(_condition) {
    try {
      const vouchers = await Voucher.findAll({where: _condition},{raw: true})
      return Promise.resolve(vouchers)
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
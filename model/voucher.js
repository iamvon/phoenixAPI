const Voucher       = require('../database').Voucher
const randomstring  = require('randomstring') 
const Shop          = require('./shop')
const Point         = require('./Point')

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
      let vouchers = await Voucher.findOne({where: _condition})
      for (let v of vouchers) {                        
        v.dataValues['PointName'] = await Point.getName(v.dataValues.PointID)
      }
      return Promise.resolve(vouchers)
    } catch (error) {
      return Promise.reject(error)
    }
  },

  findAllCondition: async function(_condition) {
    try {
      let vouchers = await Voucher.findAll({where: _condition, raw: true})           
      for (let v of vouchers) {                
        const shop = await Shop.getInfo(v.shopId)
        v['shopName'] = shop.name        
        v['PointName'] = await Point.getName(shop.PointID)
      }      
      return Promise.resolve(vouchers)
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
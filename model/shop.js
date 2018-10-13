const User        = require('./user')
const Shop        = require('../database').Shop
const ShopSMI     = require('../smart-contract/shopInfinito')
const Point       = require('./Point')

module.exports = {
  insert: async function(id) {
    return Shop.create({shopId: id})
  },

  getInfo: async function(id) {
    return Shop.findById(id, {raw:true})
  },

  getAllCondition: async function(_condition) {
    let shops = await Shop.findAll({where: _condition, raw: true})
    console.log(shops)
    for (let s of shops) {
      const ss = await this.getInfo(s.shopId)
      s['PointName'] = await Point.getName(ss.PointID)
    }
    console.log(shops)
    return Promise.resolve(shops)
  },

  updateDiscount: async function(_shopId, _discount, _pointNeed) {
    try {
      if (_discount < 0 || _discount > 100)
        return Promise.reject(new Error('Invalid discount amount'))
      let shop = await Shop.findById(_shopId)
      if (shop == undefined) return Promise.reject(new Error('Invalid Shop'))
              
      await shop.update({
        discount: _discount,
        pointNeedToCashout: _pointNeed
      })      
      return Promise.resolve(shop)
    } catch (error) {
      return Promise.reject(error)
    }
  },

  getPoint: async function(_shopId) {                           
    const ShopSM = require('../smart-contract/shopInfinito')
    try {      
      const shop = await User.getById(_shopId)      
      if (shop == undefined)
        return Promise.reject(new Error('Invalid shopId'))
      if (shop.PublicAddress == undefined)
        return Promise.reject(new Error('Shop does not have address'))      

      const result = await ShopSM.shopToPoint(shop.PublicAddress)            
      return Promise.resolve(result)
    } catch (error) {
      return Promise.reject(error)
    }
  },

  rewardPoint: async function(_shopId, _customerId) {
    const User = require('./user')
    try {
      const __shop      = await this.getInfo(_shopId)      
      const PointID     = __shop.PointID
      const reward      = __shop.reward
      const shop        = await User.getById(_shopId)
      const customer    = await User.getById(_customerId)

      const transaction = await ShopSMI.shopTransferPoint(customer.PublicAddress, PointID, reward, shop.PrivateKey)      
      const result = {
        senderId: _shopId,
        recepientId: _customerId,
        PointID:  PointID,
        amount: reward,
        tx_id: transaction.tx_id
      }
      return Promise.resolve(result)
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
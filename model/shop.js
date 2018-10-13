var Shop = require('../database').Shop

module.exports = {
  insert: async function(id) {
    return Shop.create({shopId: id})
  },

  getInfo: async function(id) {
    return Shop.findById(id, {raw:true})
  },

  setDiscount: async function(_shopId, _discount) {
    try {
      if (_discount < 0 || _discount > 100)
        return Promise.reject(new Error('Invalid discount amount'))
      let shop = await Shop.findById(_shopId)
      if (shop == undefined) return Promise.reject(new Error('Invalid Shop'))
              
      await shop.update({discount: _discount})
      return Promise.resolve(shop)
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
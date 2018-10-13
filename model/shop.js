var Shop = require('../database').Shop

module.exports = {
  insert: async function(id) {
    return Shop.create({shopId: id})
  },
  getInfo: async function(id) {
    return Shop.findById(id, {raw:true})
  }
}
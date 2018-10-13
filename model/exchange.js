const Exchange  = require('../database').Exchange
const Point     = require('./Point')

module.exports = {
  insert: async function (_publisherId, _aPID, _aPamt, _wPID, _wPamt) {
    const exchange = await Exchange.create({
      publisherId:          _publisherId,
      availablePointID:     _aPID,
      availablePointAmount: _aPamt,
      wantingPointID:       _wPID,
      wantingPointAmount:   _wPamt
    }, {raw: true})
    return exchange.exchangeId
  },

  approve: async function(_traderId, _exchangeId) {
    let exchange = await Exchange.findById(_exchangeId)        
    return exchange.update({
      traderId: _traderId,
      isApproved: 1
    })
  },

  findById: async function(_exchangeId) {
    return Exchange.findById(_exchangeId)
  },

  getAllCondition: async function(_condition) {
    let exchanges = await Exchange.findAll({where: _condition, raw: true})
    for (let e of exchanges) {
      e.availablePointName = await Point.getName(e.availablePointID)
      e.wantingPointName = await Point.getName(e.wantingPointID)
    }
    return exchanges
  }
}
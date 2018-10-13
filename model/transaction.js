const User        = require('./user')
const Transaction = require('../database').Transaction
const CustomerSM  = require('../smart-contract/consumer')

module.exports = {
  verify: async function(_sender, _PointID, _amount) {
    if (_sender.userType == 'Customer') {
      // let Wallet = await Customer.getWallet(_sender.userId)
      let Wallet = await CustomerSM.customerWallet(_sender.PublicAddress)
      Wallet = Wallet.filter(x => x.pointID == _PointID)      
      if (Wallet.length != 1 || parseInt(Wallet[0].currentAmount) < _amount)
        return Promise.reject(new Error(`Customer Account does not have enough Point ${_PointID}`))
    } else {
      const shop = await User.getInfo(_sender.userId)
      // Point Type does not belong to the shop
      if (shop.PointID != _PointID) 
        return Promise.reject(new Error(`Shop cannot transfer Point ${_PointID}`))
    }
    return Promise.resolve(true)
  },

  upload: async function(_senderId, _recepientId, _PointID, _amount) {
    if (_PointID == undefined || _amount == undefined)
      return Promise.reject(new Error('Invalid PointID or Not specific amount of point'))

    try {
      const [sender, recepient] = await Promise.all([
        User.getById(_senderId), User.getById(_recepientId)
      ])

      // classify transaction type
      let _transactionType
      if (sender.userType == 'Customer' && recepient.userType == 'Customer')
        _transactionType = 'Exchange'
      else if (sender.userType == 'Customer')
        _transactionType = 'Cashout'
      else if (recepient.userType == 'Customer')
        _transactionType = 'Reward'
      else
        return Promise.reject(new Error('Shops cannot transfer point to each others'))
      
      // check if sernder has enough point
      await this.verify(sender, _PointID, _amount)
      console.log('ahihi')
      const transaction = await Transaction.create({
        senderId:         _senderId,
        recepientId:      _recepientId,
        transactionType:  _transactionType,
        PointID:          _PointID,
        amount:           _amount
      }, {raw: true})
      return Promise.resolve(transaction) 
    } catch (error) {
      return Promise.reject(error)
    }    
  },

  getAllCondition: async function(_condition) {
    console.log(_condition)
    return Transaction.findAll({where: _condition}, {raw: true})
  }
}
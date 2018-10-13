const User        = require('../database').User
const Customer    = require('../database').Customer
const Shop        = require('./shop')
const Voucher     = require('./voucher')
const Exchange    = require('./exchange')
const Transaction = require('./transaction')
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
      const user = await User.findById(userId, {raw: true})
      // console.log(user)
      const Wallet = await CustomerSM.customerWallet(user.PublicAddress)
      // console.log(Wallet)
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
  },

  proposeExchange: async function(_publisherId, _aPID, _aPamt, _wPID, _wPamt) {
    try {
      const publisher = await User.findById(_publisherId, {raw: true})
      let wallet = await this.getWallet(_publisherId)  
      wallet = wallet.filter(x => x.pointID == _aPID)
      if (parseInt(wallet[0].currentAmount) < _aPamt) 
        return Promise.reject(new Error(`Not Enough Point ${_aPID} to exchange`))
      console.log(132131)
      const transaction = await CustomerSMI.customerSendPointExchange(
        publisher.PublicAddress,
        _aPID, _wPID,
        _aPamt, _wPamt,
        publisher.PrivateKey
      )      
      console.log(13123213213213)
      const result = await Exchange.insert(_publisherId, _aPID, _aPamt, _wPID, _wPamt)

      return Promise.resolve({exchangeId: result, tx_id: transaction.tx_id})
    } catch (error) {
      return Promise.reject(error)
    } 
  },

  approveExchange: async function(_traderId, _exchangeId) {
    try {
      let exchange = await Exchange.findById(_exchangeId)
      if (exchange == null) return Promise.reject(new Error('Invalid exchangeId'))
      exchange = exchange.dataValues
      if (exchange.isApproved) return Promise.reject(new Error('Cannot approve this exchange requirement anymore'))

      let wallet = await this.getWallet(_traderId)      
      wallet = wallet.filter(w => w.pointID == exchange.wantingPointID)            
      if (wallet.length != 1 || parseInt(wallet[0].currentAmount) < exchange.wantingPointAmount)
        return Promise.reject(new Error(`Not enough Point ${exchange.wantingPointID} to approve`))
      
      const trader    = (await User.findById(exchange.traderId)).dataValues
      const publisher = (await User.findById(exchange.publisherId)).dataValues
      
      
      await CustomerSMI.traderApproveExchange(
        trader.PublicAddress,           // trader
        publisher.PublicAddress,        // publisher
        exchange.availablePointID,      // pointPublisherID
        exchange.wantingPointID,        // pointTraderID
        exchange.availablePointAmount,  // pointPublisherAmount
        exchange.wantingPointAmount,    // pointTraderAmount
        publisher.PrivateKey
      )      
      
      await Transaction.upload(publisher.userId, trader.userId, exchange.availablePointID, exchange.availablePointAmount)
      await Transaction.upload(trader.userId, publisher.userId, exchange.wantingPointID, exchange.wantingPointAmount)

      await Exchange.approve(_traderId, _exchangeId)

      return Promise.resolve('success')  
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
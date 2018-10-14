const SDKutil = require('./SDKutil');
const api = SDKutil.api;
var genWallet = SDKutil.genWallet;
var txParams = SDKutil.txParams;
var my_consumer = require('./consumer')

/**
 * payback Point after expired trading  
 */
var expiredTrading = (publisher, pointPublisherID, pointPublisherAmount, privateKey) => {
  return new Promise((resolve, reject) => {
    txParams.sc.nameFunc = 'expiredTrading';
    txParams.sc.typeParams = ['address', 'uint256', 'uint256'];
    txParams.sc.paramsFuncs = [publisher, pointPublisherID, pointPublisherAmount];
    var wallet = genWallet(privateKey);
    wallet.setApi(api);
    SDKutil.executeT(txParams, wallet)
      .then((result) => {
        resolve(result)
      }, (error) => {
        reject(error)
      })
  })
}

// <1> customer calling this, require private key
/**
 * Send Point when proposing a trading require
 */
var customerSendPointExchange = (publisher, pointPublisherID, pointTraderID, pointPublisherAmount, pointTraderAmount, privateKey) => {
  return new Promise((resolve, reject) => {
    txParams.sc.nameFunc = 'customerSendPointTrading';
    txParams.sc.typeParams = ['address', 'uint256', 'uint256', 'uint256', 'uint256'];
    txParams.sc.paramsFuncs = [publisher, pointPublisherID, pointTraderID, pointPublisherAmount, pointTraderAmount];
    var wallet = genWallet(privateKey);
    wallet.setApi(api);
    SDKutil.executeT(txParams, wallet).then((result) => {
      resolve(result)
    }, (error) => {
      reject(error)
    })
  })
}

// <2> trader calling this, require private key
var traderApproveExchange = (trader, publisher, pointPublisherID, pointTraderID, pointPublisherAmount, pointTraderAmount, privateKey) => {
  return new Promise((resolve, reject) => {
    txParams.sc.nameFunc = 'traderApproveTrading';
    txParams.sc.typeParams = ['address', 'address', 'uint256', 'uint256', 'uint256', 'uint256'];
    txParams.sc.paramsFuncs = [trader, publisher, pointPublisherID, pointTraderID, pointPublisherAmount, pointTraderAmount];
    var wallet = genWallet(privateKey);
    wallet.setApi(api);
    SDKutil.executeT(txParams, wallet).then((result) => {
      resolve(result)
    }, (error) => {
      reject(error)
    })
  })
}

// <3> customer calling this, require private key. 
var customerTransferPointToCustomer = (to, pointID, pointsTransfer, privateKey) => {
  return new Promise((resolve, reject) => {
    txParams.sc.nameFunc = 'customerTransferPointToCustomer';
    txParams.sc.typeParams = ['address', 'uint', 'uint'];
    txParams.sc.paramsFuncs = [to, pointID, pointsTransfer];
    var wallet = genWallet(privateKey);
    wallet.setApi(api);
    SDKutil.executeT(txParams, wallet).then((result) => {
      resolve(result)
    }, (error) => {
      reject(error)
    })
  })
}

// customerTransferPointToCustomer("0x086c1268DFea79eaa32DbA2271DeCF685049753D", 6, 69, "0xCB706FED304AD0B0CF8EB019415ED31BA803F8C1E253088DF5AAA56A1AAB96AF")
// .then((result) => {
//     console.log(result.tx_id);
// }, (error) => {
//     console.log(error);
// })

// <4> customer calling this, require private key. 
var customerTransferPointToShop = (to, pointID, pointsTransfer, privateKey) => {
  return new Promise((resolve, reject) => {
    txParams.sc.nameFunc = 'customerTransferPointToShop';
    txParams.sc.typeParams = ['address', 'uint', 'uint'];
    txParams.sc.paramsFuncs = [to, pointID, pointsTransfer];
    var wallet = genWallet(privateKey);
    wallet.setApi(api);
    SDKutil.executeT(txParams, wallet).then((result) => {
      resolve(result)
    }, (error) => {
      reject(error)
    })
  })
}

module.exports = {
  expiredTrading,
  customerSendPointExchange,
  traderApproveExchange,
  customerTransferPointToCustomer,
  customerTransferPointToShop
}

// async function test () {
//   const walletBefore = await my_consumer.customerWallet(
//     '0x086c1268DFea79eaa32DbA2271DeCF685049753D'
//   )
//   console.log(walletBefore)

//   const transaction = await customerSendPointExchange(
//     '0x086c1268DFea79eaa32DbA2271DeCF685049753D',
//     '0', '5',
//     '1', '1',
//     '0xF548F89CBB264DAA8C1C80AA948AB1E808173CC0C9AF25A4C5207E81CDD45D58')
//   console.log(transaction)
  
//   const walletAfter = await my_consumer.customerWallet('0x086c1268DFea79eaa32DbA2271DeCF685049753D')
//   console.log(walletAfter)

//   return Promise.resolve('success')
// }

// test()
//   .then(result => console.log(result))
//   .catch(error => console.log(error))


// my_consumer.customerWallet('0x086c1268DFea79eaa32DbA2271DeCF685049753D')
//   .then(result => {
//     console.log(result)
//     return customerSendPointExchange(
//       '0x086c1268DFea79eaa32DbA2271DeCF685049753D',
//       '0', '5',
//       '1', '1',
//       '0xF548F89CBB264DAA8C1C80AA948AB1E808173CC0C9AF25A4C5207E81CDD45D58'
//     )
//   })
//   .then(result => {
//     console.log(result)
//     return my_consumer.customerWallet('0x086c1268DFea79eaa32DbA2271DeCF685049753D')
//   })  
//   .then(result => {
//     console.log(result)
//   })
//   .catch(error => console.log(error))

// customerSendPointExchange(
//   '0x086c1268DFea79eaa32DbA2271DeCF685049753D',
//   '0', '5',
//   '1', '1',
//   '0xF548F89CBB264DAA8C1C80AA948AB1E808173CC0C9AF25A4C5207E81CDD45D58'
// )
//   .then(result => {
//     console.log('2-----------')
//     console.log(result)
//   })
//   .catch(error => console.log(error))
const SDKutil = require('./SDKutil');
const api = SDKutil.api;
var genWallet = SDKutil.genWallet;
var txParams = SDKutil.txParams;

var util = require('./web3Util');
var contract = util.contract;

/**
 * Query amount of Point shop is holding
 */
var shopToPoint = (shopAdr) => {  
  return new Promise((resolve, reject) => {
    contract.methods.shopToPoint(shopAdr).call().then((result) => {
      var pointInfo = {
        name: result.name,
        symbol: result.symbol,
        decimals: result.decimals,
        totalSupply: result.totalSupply,
        currentAmount: result.currentAmount,
        pointID: result.pointID

      }
      // console.log(pointInfo)
      resolve(pointInfo)
    }, (error) => {
      reject(`Can not find point of this shop ${error}`);
    })
  })
}

var shopTransferPoint = (to, pointID, amount, shopPrivateKey) => {
  return new Promise((resolve, reject) => {
    txParams.sc.nameFunc = 'shopTransferPoint';
    txParams.sc.typeParams = ['address', 'uint', 'uint'];
    txParams.sc.paramsFuncs = [to, pointID, amount];
    var wallet = genWallet(shopPrivateKey);
    wallet.setApi(api);
    SDKutil.executeT(txParams, wallet).then((result) => {
      resolve(result)
    }, (error) => {
      reject(error)
    })
  })
}

// shopTransferPoint('0xdc6Ad0791e386000fF9dF8dE35716603bD4BC745',
//           0,
//           10,
//           '0xF54CD0EA34CD780CEE510BF4DB7DE53DCB83FA8AB49F12736ECCDA190DF85D55')
//   .then(result => console.log(result))
//   .catch(error => console.log(error))

var createPoint = (_shopAddress, _pointName, _pointSymbol, _pointDecimals, _initialSupply, ownerPrivateKey) => {
  return new Promise((resolve, reject) => {
    txParams.sc.nameFunc = 'createPoint';
    txParams.sc.typeParams = ['address', 'string', 'string', 'uint8', 'uint256'];
    txParams.sc.paramsFuncs = [_shopAddress, _pointName, _pointSymbol, _pointDecimals, _initialSupply];
    var wallet = genWallet(ownerPrivateKey);
    wallet.setApi(api);
    SDKutil.executeT(txParams, wallet).then((result) => {
      resolve(result)
    }, (error) => {
      reject(error)
    })
  })
}

var earnMorePoint = (_pointID, _amount, ownerPrivateKey) => {
  return new Promise((resolve, reject) => {
    txParams.sc.nameFunc = 'earnMorePoint';
    txParams.sc.typeParams = ['uint256', 'uint256'];
    txParams.sc.paramsFuncs = [_pointID, _amount];
    var wallet = genWallet(ownerPrivateKey);
    wallet.setApi(api);
    SDKutil.executeT(txParams, wallet).then((result) => {
      resolve(result)
    }, (error) => {
      reject(error)
    })
  })
}

module.exports = {
  shopToPoint,
  shopTransferPoint
}

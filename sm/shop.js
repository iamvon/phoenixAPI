var util = require('./web3Util');
var contract = util.contract;

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
            resolve(pointInfo)

        }, (error) => {
            reject(`Can not find point of this shop ${error}`);
        })
    })
}

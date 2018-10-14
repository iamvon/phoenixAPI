var util = require('./web3Util');
var contract = util.contract;

var sendJSONresponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

//customer to specific point id
var customerToPoint = (address, pointId) => {
    return new Promise((resolve, reject) => {
        contract.methods.customerToPoint(address, pointId).call().then((result) => {
            resolve(result);
        }, (error) => {
            reject(`can't find customer to point ${error}`);
        })
    })

}

// handle promises
var recursion = (address, result, count) => {
    return new Promise((resolve, reject) => {
        count = parseInt(count);
        if (count === -1) {
            
            resolve(result)
        }
        if (typeof count !== typeof 2) {
            reject(`error type of count, count must be a number ${error}`)
        } else {
            customerToPoint(address, count).then((pointInfo) => {
                if (pointInfo.currentAmount !== '0') {
                    var pointIf = {
                        pointID: pointInfo.pointID,
                        name: pointInfo.name,
                        symbol: pointInfo.symbol,
                        currentAmount: pointInfo.currentAmount,
                    }
                    result.push(pointIf);
                }
                return recursion(address, result, count - 1).then((result) => {
                    resolve(result);
                }, (error) => {
                    reject(`recursion error! ${error}`);
                });
            });
        }
})

}
// customer's wallet, return a Promise with result = array of point info || = [] if empty
var customerWallet = (address) => {
    return new Promise((resolve, reject) => {
        contract.methods.pointCount().call().then((count) => {
            recursion(address, [], count).then((result) => {
                resolve(result);
            }, (error) => {
                reject(`error: ${error}`);
            });
        })
    })

}

module.exports = {
    customerToPoint,
    customerWallet
}

// customerWallet("0x32dA8eED08D6ae33167b9afb58fae1fCAE1eb1F2").then(result => console.log(result))
// contract owner call this, require private key

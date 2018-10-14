const Web3 = require('web3');
const fs = require('fs');
//const ganacheURL = 'http://localhost:7545';


var initWeb3 = () => {
    //  (1) change the provider: infura or ganache
    var web3Provider = new Web3.providers.HttpProvider(infuraURL);
    web3 = new Web3(web3Provider);
    return web3;
}

var initContract = (web3, jsonPath, address) => {
    var ABIString = fs.readFileSync(jsonPath);
    var ABI = JSON.parse(ABIString).abi;
    return new web3.eth.Contract(ABI, address);

}
var executeSendMethod = (method, privateKey, contractInstance) => {
    return new Promise((resolve, reject) => {
        method.estimateGas({
            from: web3.eth.accounts.privateKeyToAccount(privateKey).address,
            gas: 3000000
        }).then((gas) => {
            var tx = {
                to: contractInstance.options.address,
                gas: gas * 2,
                gasPrice: 1000000000,
                data: method.encodeABI()
            };
            web3.eth.accounts.privateKeyToAccount(privateKey).signTransaction(tx)
                .then(signed => {
                    var tran = web3.eth.sendSignedTransaction(signed.rawTransaction);
                    tran.on('receipt', receipt => {
                        //console.log(receipt);
                        resolve(receipt);
                    });
                    tran.on('error', (error) => {
                        reject("error to send signed tx:", error);
                    });
                });
        }, (error) => {
            console.log("can not estimate gas");
        })

    })

}
const infuraURL = 'https://ropsten.infura.io/v3/9ff087f6232f43998ea7c7c3b3d22e10';
const coinContractRopstenAddress = "0x4729063D74275894231C1467AdCc6FC43392bA84";
var web3 = initWeb3();
var contract = initContract(web3, "./Coin.json", coinContractRopstenAddress);
module.exports = {
    initWeb3,
    initContract,
    executeSendMethod,
    contract
}



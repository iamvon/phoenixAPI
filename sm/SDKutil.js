const {CoinType, EthWallet, InfinitoApi } = require('node-infinito-wallet');

const apiConfig = {
    apiKey: '0dda8e7f-a7b3-445b-80a0-f5ca66339081',
    secret: 'B9JoneDZJdxdEWp2mVXq2qYC9ZWubEYRz6vloHEtUAp1gbyJiXdWvF8Z9bTaCTyo',
    baseUrl: 'https://staging-api-testnet.infinitowallet.io',
    logLevel: 'NONE'
};
const api = new InfinitoApi(apiConfig);

var genWallet = (privateKey) => {
    const walletConfig = {
        coinType: CoinType.ETH.symbol,  // change for case ETH
        isTestNet: true,
        privateKey: privateKey
    }
    return new EthWallet(walletConfig);
}

let txParams = {};
txParams.sc = {};
txParams.sc.contractAddress = "0x4729063D74275894231C1467AdCc6FC43392bA84"; 
txParams.gasLimit = 330946;
async function executeT(txParams, wallet) {
    let rawTx = await wallet.createRawTx(txParams);
    let result = await wallet.send({
        rawTx: rawTx,
        isBroadCast: true
    });
    return Promise.resolve(result);
}
module.exports = {
    txParams,
    genWallet,
    api,
    executeT
}
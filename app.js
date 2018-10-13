const jsonParser  = require('body-parser').json()

const express     = require('express');
const app         = express();

const User        = require('./model/user')
const Customer    = require('./model/customer')
const Shop        = require('./model/shop')
const Transaction = require('./model/transaction')
const Exchange    = require('./model/exchange')

// Setting CORS
app.use((req, res, next) => {   // hỗ trợ nhận request post/get chứa cookie dạng json từ client
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,X-Requested-With,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  next();
});  


// public folder
app.use(express.static('data'));

app.use(jsonParser)

// Template for sending response
var sendJSONresponse = function(response, _status, _content) {  
  response.status(_status)
  response.json(_content)
}

/* Testing */
app.get('/test/:shopId', (req, res) => {        
  Shop.getPoint(req.params.shopId)
    .then(result => sendJSONresponse(res, 200, result))
    .catch(error => sendJSONresponse(res, 404, {error: error.message}))
})

/* Routing */

app.post('/signin', (req, res) => {
  const [_username, _password] = [req.body.username, req.body.password]  
  User.authenticateAccount(_username, _password)
    .then(result => {
      console.log('Signin Successfully ' + result)
      sendJSONresponse(res, 200, result)
    })
    .catch(error => {
      res.status(404)
      res.send({error: error.message})            
    })  
})

app.post('/register', (req, res) => {
  const [_username, _password, _userType] = [req.body.username, req.body.password, req.body.userType]
  User.insertNewUser(_username, _password, _userType)
    .then(result => {
      res.send({token: result})
    })
    .catch(error => {
      res.status(404)
      res.send(error.message)
      console.log(error.message)
    })
})

/**  
 * Get infomation of a particular user irrespective Customer or Shop
 */
app.get('/user/:id', (req, res) => {  
  User.getInfo(req.params.id)
    .then(result => {
      res.json({result: result})
    })
    .catch(error => {
      res.sendStatus(404)
      console.log(error.message)
    })
}) 

/**
 * Customer cashes out his/her point to voucher of a shop 
 */
app.post('/customer/:customerId/shop/:shopId/voucher', (req, res) => {
  Customer.cashOut(req.params.customerId, req.params.shopId)
    .then(result => {
      res.send({result: result})
    })
    .catch(error => {
      res.status(404)
      res.send({error: error.message})      
    })
})

/**
 * Customer uses a voucher. Need to import code of voucher to verify. 
 */
app.put('/customer/:customerId/voucher', (req, res) => {
  const code = req.body.code
  Customer.useVoucher(req.params.customerId, code)
    .then(result => {
      res.send({result: result})
    })
    .catch(error => {
      res.sendStatus(404)
      console.log(error.message)
    })
})

/**
 * Customer gets all of his/her vouchers 
 */
app.get('/customer/:customerId/voucher', (req, res) => {
  Customer.getOwningVoucher(req.params.customerId)
    .then(result => {
      res.send(result)
    })
    .catch(error => {
      res.status(404)
      res.send(error.message)
    })
})

/**
 * Get all kind of voucher
 */
app.get('/voucher', (req, res) => {
  Shop.getAllCondition({})
    .then(result => sendJSONresponse(res, 200, result))
    .catch(error => sendJSONresponse(res, 404, error))
})

/**
 * Customer get all of voucher he/she can cash out
 */
app.get('/customer/:customerId/potentialVoucher', (req, res) => {
  Customer.getPotentialVoucher(req.params.customerId)
    .then(result => sendJSONresponse(res, 200, result))
    .catch(error => sendJSONresponse(res, 404, {error: error.message}))
}) 

/**
 * Customer get his/her transaction history 
 */
app.get('/user/:userId/transaction', (req, res) => {
  const condition = {$or:[{senderId: req.params.userId}, {recepientId: req.params.userId}]}
  Transaction.getAllCondition(condition)
    .then(result => sendJSONresponse(res, 200, result))
    .catch(error => sendJSONresponse(res, 404, {error: error}))
})

/**
 * Customer' s Wallet
 */
app.get('/customer/:customerId/wallet', (req, res) => {
  Customer.getWallet(req.params.customerId)
    .then(result => sendJSONresponse(res, 200, result))
    .catch(error => sendJSONresponse(res, 404, {error: error.message}))
})

/**
 * Customer proposing exchange
 */
app.post('/customer/:customerId/exchange', (req, res) => {
  Customer.proposeExchange(
    req.params.customerId,
    req.body.availablePointID,
    req.body.availablePointAmount,
    req.body.wantingPointID,
    req.body.wantingPointAmount)
    .then(result => sendJSONresponse(res, 200, result))
    .catch(error => sendJSONresponse(res, 404, {error: error.message}))
})

/**
 * Customer approve an exchange
 */
app.put('/customer/:customerId/exchange/:exchangeId', (req, res) => {
  Customer.approveExchange(req.params.customerId, req.params.exchangeId)
    .then(result => sendJSONresponse(res, 200, result))
    .catch(error => sendJSONresponse(res, 404, {error: error.message}))
})

/**
 * Search all exchange requirement
 */
app.get('/exchange', (req, res) => {
  Exchange.getAllCondition({isApproved: 0})
    .then(result => sendJSONresponse(res, 200, result))
    .catch(error => sendJSONresponse(res, 404, {error: error.message}))
})
/**
 * Shop rewards Point to Customer
 */
async function reward(_shopId, _customerId) {
  const transaction = await Shop.rewardPoint(_shopId, _customerId)
  // console.log(transaction)
  const result = await Transaction.upload(transaction.senderId, transaction.recepientId, transaction.PointID, transaction.amount)                
  // console.log('ahihi ' + result)
  return Promise.resolve(result)
}

app.post('/shop/:shopId/customer/:customerId/reward', (req, res) => {
  reward(req.params.shopId, req.params.customerId)  
    .then(result => sendJSONresponse(res, 200, result))
    .catch(error => sendJSONresponse(res, 404, {error: error.message}))
})

/**
 * Shop changes its discount amount and pointNeed 
 */
app.put('/shop/:shopId/discount', (req, res) => {
  const _discount = req.body.discount
  const _pointNeed = req.body.pointNeed
  Shop.updateDiscount(req.params.shopId, _discount, _pointNeed) 
    .then(result => {
      console.log('Update discount Successfully')
      sendJSONresponse(res, 200, result)      
    })
    .catch(error => {
      sendJSONresponse(res, 404, {error: error.message})
    })
})

/**
 * Upload a transaction of any type on database  
 */
app.post('/transaction', (req, res) => {    
  Transaction.upload(req.body.senderId, req.body.recepientId, req.body.PointID, req.body.amount)  
    .then(result => {            
      sendJSONresponse(res, 200, result)
    })
    .catch(error => {
      sendJSONresponse(res, 404, {error: error.message})
    })  
})

// PORT: listen on port 3000 unless there exists a preconfigured port
const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Listening on ${port}...`);
})
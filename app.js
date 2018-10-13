const jsonParser  = require('body-parser').json()

const express     = require('express');
const app         = express();

const User        = require('./model/user')
const Customer    = require('./model/customer')
const Shop        = require('./model/shop')

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

/* Testing */

/* Routing */

app.post('/signin', (req, res) => {
  const [_username, _password] = [req.body.username, req.body.password]
  console.log(req)
  console.log(req.body)
  User.authenticateAccount(_username, _password)
    .then(result => {
      console.log('Signin Successfully ' + result)
      res.json(result)
    })
    .catch(error => {
      res.status(404)
      res.send({error: error.message})      
      console.log(error.message)
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

/*  
  Get infomation of a particular user irrespective Customer or Shop
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

/*  
  Customer cashes out his/her point to voucher of a shop
 */
app.post('/customer/:customerId/shop/:shopId/voucher', (req, res) => {
  Customer.createVoucher(req.params.customerId, req.params.shopId)
    .then(result => {
      res.send({result: result})
    })
    .catch(error => {
      res.sendStatus(404)
      console.log(error.message)
    })
})

/*
  Customer uses a voucher. Need to import code of voucher to verify.
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

/*
  Customer gets all of his/her vouchers
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

/*
  Shop changes its discount amount
*/
app.put('/shop/:shopId/discount', (req, res) => {
  const _discount = req.body.discount
  Shop.setDiscount(req.params.shopId, _discount) 
    .then(result => {
      console.log('Set discount Successfully ' + result)
      res.send({result: result})
    })
    .catch(error => {
      res.sendStatus(404)
      console.log(error.message)
    })
})

app.post('/transaction', (req, res) => {

})

// PORT: listen on port 3000 unless there exists a preconfigured port
const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Listening on ${port}...`);
})
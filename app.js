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

// routing 
// require("./control/control").route(app);

/* Testing */

app.use(jsonParser)

app.post('/register', (req, res) => {
  const [_username, _password, _userType] = [req.body.username, req.body.password, req.body.userType]
  User.insertNewUser(_username, _password, _userType)
    .then(result => {
      res.send({token: result})
    })
    .catch(error => {
      res.sendStatus(404)
      console.log(error)
    })
})

app.get('/user/:id', (req, res) => {  
  User.getInfo(req.params.id)
    .then(result => {
      res.send({result: result})
    })
    .catch(error => {
      res.sendStatus(404)
      console.log(error)
    })
}) 

app.post('/customer/:customerId/shop/:shopId/voucher', (req, res) => {
  Customer.createVoucher(req.params.customerId, req.params.shopId)
    .then(result => {
      res.send({result: result})
    })
    .catch(error => {
      res.sendStatus(404)
      console.log(error)
    })
})

app.put('/customer/:customerId/voucher', (req, res) => {
  const code = req.body.code
  Customer.useVoucher(req.params.customerId, code)
    .then(result => {
      res.send({result: result})
    })
    .catch(error => {
      res.sendStatus(404)
      console.log(error)
    })
})

// PORT: listen on port 3000 unless there exists a preconfigured port
const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Listening on ${port}...`);
})
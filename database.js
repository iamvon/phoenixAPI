const Sequelize = require('sequelize')
const sequelize = new Sequelize('loyalty', 'root', '12345678',{
  dialect: 'mysql',
  define: {
    timestamps: false,
    freezeTableName: true
  }
})

sequelize.authenticate().then(() => {
  console.log("Successfully Connected")
})

module.exports = {
  User: sequelize.define('User', {
    userId: {
      type:         Sequelize.INTEGER(11),
      primaryKey:   true,
      autoIncrement:true
    },
    username:       Sequelize.STRING(50),
    password:       Sequelize.STRING(50),
    email:          Sequelize.STRING,
    phone:          Sequelize.STRING,
    userType:       Sequelize.STRING,
    PublicAddress:  Sequelize.STRING,
    PrivateKey:     Sequelize.STRING,
    Avatar:         Sequelize.STRING
  }),

  Customer: sequelize.define('Customer', {
    customerId: {
      type:         Sequelize.INTEGER(11),
      primaryKey:   true,
      autoIncrement:true
    },
    gender:         Sequelize.STRING,
    date_of_birth:  Sequelize.STRING
  }),

  Shop: sequelize.define('Shop', {
    shopId: {
      type:         Sequelize.INTEGER(11),
      primaryKey:   true,
      autoIncrement:true  
    },
    name:           Sequelize.STRING,
    location:       Sequelize.STRING,
    reward:         Sequelize.INTEGER,
    discount:       Sequelize.INTEGER(11),
    PointID:        Sequelize.INTEGER(11),
    pointNeedToCashout:
                    Sequelize.INTEGER
  }),  

  Voucher: sequelize.define('Voucher', {
    voucherId: {
      type:         Sequelize.INTEGER(11),
      primaryKey:   true,
      autoIncrement:true  
    },
    ownerId:        Sequelize.INTEGER(11),
    shopId:         Sequelize.INTEGER(11),
    discount:       Sequelize.INTEGER(11),
    code:           Sequelize.STRING,    
    status:         Sequelize.STRING(10),
    createdAt:      Sequelize.DATE,
    updatedAt:      Sequelize.DATE
  }, {
    timestamps: true
  }),

  Transaction: sequelize.define('Transaction', {
    transactionId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    senderId:       Sequelize.INTEGER,
    recepientId:    Sequelize.INTEGER,
    transactionType:Sequelize.STRING,
    PointID:        Sequelize.INTEGER(11),
    amount:         Sequelize.INTEGER,
    createdAt:      Sequelize.DATE,
    updatedAt:      Sequelize.DATE
  }, {
    timestamps: true
  }),

  Exchange: sequelize.define('Exchange', {
    exchangeId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    publisherId:          Sequelize.INTEGER,
    traderId:             Sequelize.INTEGER,
    availablePointID:     Sequelize.INTEGER,
    availablePointAmount: Sequelize.INTEGER,
    wantingPointID:       Sequelize.INTEGER,
    wantingPointAmount:   Sequelize.INTEGER,
    isApproved:           Sequelize.TINYINT,
    createdAt:            Sequelize.DATE,
    updatedAt:            Sequelize.DATE
  }, {
    timestamps: true
  }),
}
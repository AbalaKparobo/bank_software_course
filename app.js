const express = require('express');
const bodyParser = require('body-parser');

const sequelize = require('./database');

const User = require('./models/user');
const Admin = require('./models/admin');
const Account = require('./models/account');
const Transaction = require('./models/transaction');

const authRoute = require('./routes/auth');
const mailRoute = require('./routes/mail');
const accountRoute = require('./routes/account'); 


const port = 8080;
const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

Account.belongsTo(User);
// Account.hasOne(User, {
//   as: 'Current',
//   foreignKey: 'currentVersionId',
//   constraints: false
// });
// User.belongsTo(Account);

Account.hasMany(Transaction);
Transaction.belongsTo(Account);



app.use((req,res,next) => {
  res.setHeader("Access-Control-Allow-Origin", '*');
  res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
  next();
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

  app.use(authRoute);
  app.use('/mail', mailRoute);
  app.use('/account', accountRoute)
  
  
  app.use((err, req, res, next) => {
    // console.log(err);
    const status = err.statusCode || 500;
    const message = err.message;
    res.status(status).json({message: message});
  })

  sequelize
    .sync()
    .then(res => {
      app.listen(process.env.PORT || port, e => {
        if (e) {console.log(e)}
        console.log(`Server is live on port ${port}`);
      })
    })
    .catch(err => console.log(err))

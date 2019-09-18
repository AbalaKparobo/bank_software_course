const mailer = require('@sendgrid/mail');
// const sendGrid_api_key = process.env.sendGrid_api_key;
const sendGrid_api_key = process.env.sendgrid_admin_api_key;

const User = require('../models/user');
const Account = require('../models/account');
const Transaction = require('../models/transaction');

exports.sendMail = (req, res, next) => {
    const userId = req.params.userId;
    let user, name, accNo, accType, refId, date, email;
    User.findOne({where: {id: userId}, attributes : {exclude: ['password']}})
      .then(result => {
          if(!result) {
              const e = new Error("No matching User found");
              e.statusCode = 404;
              throw e;
          }
          user = result.get({plain: true});
          email = user.email;
          let firstname = user.firstname.split('');
          let Firstname = firstname[0].toUpperCase() + firstname.slice(1).join('');
          let middlename, Middlename;
          if (user.middlename) {
          middlename = user.middlename.split('');
          Middlename = middlename[0].toUpperCase() + middlename.slice(1).join('')
        };
          let lastname = user.lastname.split('');
          let Lastname = lastname[0].toUpperCase() + lastname.slice(1).join('');
        if(Middlename) {
            name = Lastname + " " + Middlename + " " + Firstname;
        } else {
            name = Lastname + " " + Firstname
        }
          return Account.findOne({where: {userId: user.id}, attributes : {exclude: ['userId']}});
      })
      .then(result => {
        if(!result) {
            userDetails = {...user, msg: "User doesn't have any active account"};
            return res.status(200).json({...userDetails})
        }
        let account = result.get({plain: true});
        accNo = account.accountNumber;
        accType = account.accountType;
        return Transaction.findAll({where: {accountId: account.id}, limit: 1, order: [['createdAt', 'DESC']]});
    })
    .then(result => {
        let transaction = result[0];
        refId = transaction.refID
        date = transaction.createdAt
        return result;
    })
    .then( () => {
        mailer.setApiKey(sendGrid_api_key);
        const date = new Date();
        const msg = {
            to: email,
            from: 'internetfraud@creditmfcn.online',
            subject: 'Internet Fraud Alert',
            template_id: 'd-fb525eb1faaa4ddb8cf2e5a3613bd429',
            dynamic_template_data: {
            "name": name,
            "accNo": accNo,
            "accType": accType,
            "refId": refId.toUpperCase(),
            "subject": 'Temporary Account Closure Notification',
            // template_id:'d-ed7bbdcda5c74d41acefe298a14e39a2',
            "date" : date.toLocaleDateString()
            }
        }
        return mailer.send(msg)
    })
    .then(() => {
        return User.findOne({where: {id: userId}})
            })
    .then(result => {
        result.update({isActive: false})
            .then (r => {
                res.status(400).json({response: "Transaction Unsuccessful: Something Went wrong with the transaction" });
            })
    })
    .catch(e => {
        if(!e.statusCode) e.statusCode = 500;
        next(e)
    })
}


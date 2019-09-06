const uuid = require('uuid/v4');

const User = require('../models/user');
const Account = require('../models/account');
const Transaction = require('../models/transaction');

exports.getUsers = (req, res, next) => {
    User.findAll({attributes: {exclude: ['password']}})
    .then(result => {
        if (!result) {
            res.status(404).json({msg: 'No user for now'});
        }
        let usersArr = [];
        result.map(client => {
              usersArr.push(client.dataValues);
          });
          res.status(200).json([ ...usersArr ]);
      })
      .catch(err => {
        if(!err.statusCode) { err.statusCode = 500 };
        next(err);
      })
  }

exports.getUser = (req, res, next) => {
    const userId = req.params.userId;
    let user, account
    let transactionsArr = [];
    let userDetails = {};
    User.findOne({where: {id: userId}, attributes : {exclude: ['password']}})
      .then(result => {
          if(!result) {
              const e = new Error("No matching User found");
              e.statusCode = 404;
              throw e;
          }
          user = result.get({plain: true});
          return Account.findOne({where: {userId: user.id}});
      })
      .then(result => {
        if(!result) {
            userDetails = {...user, msg: "User doesn't have any active account"};
            return res.status(200).json({...userDetails})
        }
        account = result.get({plain: true});
        return Transaction.findAll({where: {accountId: account.id}});
    })
    .then(result => {
        if(result) {
            let arr = [...result ]
            arr.map(e => {
                e = e.dataValues;
                transactionsArr.push(e);
            })
        }
        let userDetail = {
            accountdetails: {...user, ...account},
            transactions: transactionsArr.length > 0 ? [...transactionsArr] : null
        }
        return userDetails = userDetail;        
    })
    .then(result => {
        res.status(200).json(result)
      })
      .catch(e => {
          if(!e.statusCode) e.statusCode = 500;
          next(e)
      })
}

  exports.deleteUser = (req, res, next) => {
      const userId = req.params.userId;
      let user, account, foundUser;
      if(!userId) {
          const err = new Error('Bad Request');
          err.statusCode = 400;
          throw err;
        }
        User.findOne({
            where: {id: userId}
        })
        .then(result => {
            foundUser = result;
            user = result.dataValues;
            if(!user) {
                const err = new Error('User Does Not Exist');
                err.statusCode = 404;
                throw err;
            }
            return Account.findOne({where: {userId: user.id}});
        })
        .then(result => {
            result ? account = result.dataValues : " " ;
            return Transaction.destroy({where: {accountId: account.id}});
        })
        .then(() => {
            return Account.destroy({where: {userId: userId}})
        })
        .then(() => {
            return foundUser.destroy();
        })
        .then(() => {
            res.status(200).json({msg: "Sucessfully deleted User"});
        })
        .catch(e => {
            if(!e.statusCode) { e.statusCode = 500 };
            next(e);
        })
  }

  exports.postTransaction = (req, res, next) => {
      const amount = req.body.amount;
      const otherParty = req.body.otherParty;
      const details = req.body.details;
      const transactionType = req.body.transactionType;
      const transactionMethod = req.body.transactionMethod;
      const status = req.body.status;
      const createdAt = req.body.date;
      const accountId = req.body.accountId;
      let accountBal;
      let account, cAccount;
      Account.findByPk(accountId)
        .then(result => {
            if(!result) {
                const e = new Error('No Matching Client Account Found');
                e.statusCode = 404;
                throw e;
            }
            account = {...result.dataValues};
            accountBal = account.accountBalance;
            if(transactionType == 'debit') {
                if(accountBal < amount) {
                    const e = new Error('Insufficient Funds to continue transaction')
                    e.statusCode = 400;
                    throw e;
                }
            }
            transactionType == 'debit' ? accountBal -= amount : accountBal += amount;
            return Transaction.create({
                refID: uuid(),
                amount,
                otherParty,
                details,
                transactionType,
                transactionMethod,
                status,
                createdAt,
                accountId,
                totalBalance: accountBal
            })
        })
        .then((res) => {
            return Account.findOne({where: {id: accountId}})
            })
            .then(result => {
                result.update({accountBalance: accountBal})
                  .then (r => {
                      res.status(200).json(r.dataValues);
                  })
            })    
        .catch(e => {
            if(!e.statusCode) e.statusCode = 500;
            next(e);
        })
  }
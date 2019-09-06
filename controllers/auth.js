const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const { validationResult } = require('express-validator/check');

const Admin = require('../models/admin');
const User = require('../models/user');
const Account = require('../models/account');

exports.adminSignup = (req, res, next)=> {
    // const errors = validationResult(req);
    // if(!errors.isEmpty()) {
    //     const error = new Error('User signup validation failed')
    //     error.statusCode = 422;
    //     error.data = error.array();
    //     throw error;
    // }
    const email = req.body.email.toLowerCase();
    const password = req.body.password;
    const username = req.body.username.toLowerCase();
    bcrypt.hash(password, 12)
      .then(hashedPassword => {
          Admin.create({
              email: email,
              password: hashedPassword,
              username: username
          }).then(result => {
          res.status(201).json({message: 'New Admin created successfully', userId: result.dataValues.id})
          })
          .catch(err => {
              if(!err.statusCode) { err.statusCode = 500; }
                next(err)
      });
    });
}

exports.adminLogin =(req, res, next) => {
  // const errors = validationResult(req);
    // if(!errors.isEmpty()) {
    //     const error = new Error('User signup validation failed')
    //     error.statusCode = 422;
    //     error.data = error.array();
    //     throw error;
    // }
    const email = req.body.email.toLowerCase();
    const password = req.body.password
    let user;
    Admin.findOne({
      where: {email: email}
    })
    .then(result => {
      if(!result) {
        const error = new Error('Invalid Login Details');
        error.statusCode = 401
        throw error;
      }
      user = result.dataValues;
      return bcrypt.compare(password, user.password); 
    })
    .then(isSame => {
      if(!isSame) {
        const error = new Error('Invalid Login Details');
        error.statusCode = 401
        throw error;
      }
      const token = jwt.sign({userEmail: user.email, userId: user.id}, process.env.jwt_secret, {expiresIn: '1h'});
      res.status(200).json({token: token, adminId: user.id, email: user.email, username: user.username, isAdmin: true})
    })
    .catch(err => {
      if(!err.statusCode) {err.statusCode = 500};
      next(err);
    })
}

exports.userSignup = (req, res, next) => {
  const email = req.body.email.toLowerCase();
  const firstname = req.body.firstname;
  const middlename = req.body.middlename;
  const lastname = req.body.lastname;
  const username = req.body.username.toLowerCase();
  const password = req.body.password;
  const phoneNumber = req.body.phoneNumber;
  const ssn = req.body.ssn;
  const dateOfBirth = req.body.dateOfBirth;
  const address = req.body.address;
  const state = req.body.state;
  const country = req.body.country;
  const createdAt = req.body.createdAt;
  const accountNumber = req.body.accountNumber;
  const accountType = req.body.accountType;
  const accountBalance = req.body.accountBalance;
  const accountManagerName = req.body.accountManagerName;
  const accountManagerEmail = req.body.accountManagerEmail;
  const accountManagerTel = req.body.accountManagerTel;
  let createdUser ;
  bcrypt.hash(password, 12)
  .then(hashedPassword => {
      User.create({
          email: email,
          firstname: firstname,
          middlename: middlename,
          lastname: lastname,
          username: username,
          password: hashedPassword,
          phoneNumber,
          ssn,
          dateOfBirth,
          address,
          state,
          country,
          createdAt
      })
      .then(result => {
        createdUser = result.dataValues;
        return Account.create({
          accountNumber,
          accountType,
          accountBalance,
          accountManagerName,
          accountManagerEmail,
          accountManagerTel,
          userId: createdUser.id
        });
      })
      .then(result => {
        res.status(201).json({
          message: 'New user created successfully',
          newUserId: createdUser.id,
          newUser: createdUser.firstname + " " + createdUser.lastname,
          userAccountNumber: result.dataValues.accountNumber,
          userAccountBalance: result.dataValues.accountBalance
        });
      })
      .catch(err => {
        if(!err.statusCode) { err.statusCode = 500; }
          next(err);
  });
});
}

exports.userLogin =(req, res, next) => {
  // const errors = validationResult(req);
    // if(!errors.isEmpty()) {
    //     const error = new Error('User signup validation failed')
    //     error.statusCode = 422;
    //     error.data = error.array();
    //     throw error;
    // }
  // const email = req.body.email.toLowerCase();
  const username = req.body.username.toLowerCase();
  const password = req.body.password
  let user;
  User.findOne({
    where: {username: username}
  })
    .then(result => {
      if(!result) {
        const error = new Error('Invalid Login Details');
        error.statusCode = 401
        throw error;
      }
      user = result.dataValues;
      return bcrypt.compare(password, user.password); 
    })
    .then(isSame => {
      if(!isSame) {
        const error = new Error('Invalid Login Details');
        error.statusCode = 401
        throw error;
      }
      const token = jwt.sign({
        userEmail: user.email, 
        UserId: user.id,
      }, process.env.jwt_secret,{expiresIn: '1h'});
      res.status(200).json({token: token, userId: user.id, firstname: user.firstname, lastname: user.lastname, middlename: user.middlename, email: user.email, username: user.username})
    })
    .catch(err => {
      if(!err.statusCode) { err.statusCode = 500 };
      next(err);
    })
}

exports.getAdmins = (req, res, next) => {
  Admin.findAll({attributes: {exclude: ['password', 'updatedAt']}})
  .then(result => {
      if (!result) {
          return res.status(404).json({msg: 'No Admin found'});
      }
      let adminsArr = [];
      result.map(admins => {
            adminsArr.push(admins.dataValues);
        });
        res.status(200).json([ ...adminsArr ]);
    })
    .catch(err => {
      if(!err.statusCode) { err.statusCode = 500 };
      next(err);
    })
}

exports.deleteAdmin = (req, res, next) => {
  const adminId = req.params.adminId;
  Admin.findOne({where: {id : adminId}})
    .then(result => result.destroy() )
    .then(() => {
      res.status(200).json({msg: "Successfully Deleted an Admin"})
    })
    .catch(e => {
      if(!e.statusCode) {e.statusCode = 500};
      next(e);
    })
}
const express = require('express');

const mailController = require('../controllers/mail');

const { isAuth } = require('../middewares/is-auth');

const router = express.Router();

router.get('/account/suspense/:userId', isAuth, mailController.sendMail)

module.exports = router;
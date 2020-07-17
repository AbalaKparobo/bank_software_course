const express = require('express');

const { isAuth } = require('../middewares/is-auth');

const   router = express.Router();

const adminController = require('../controllers/account');

router.get('/users', isAuth, adminController.getUsers);

router.get('/:userId', isAuth, adminController.getUser);

router.delete('/:userId', isAuth, adminController.deleteUser);

// TRANSACTION ROUTES
router.post('/transaction', isAuth, adminController.postTransaction);

module.exports = router;
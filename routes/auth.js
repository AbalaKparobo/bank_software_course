const express = require('express');

const { isAuth } = require('../middewares/is-auth');
const { isActive } = require('../middewares/is-active');

const authController = require('../controllers/auth');

const router = express.Router();

router.post('/admin/register', isAuth, authController.adminSignup)

router.post('/admin/login', authController.adminLogin);

router.post('/user/register', isAuth, authController.userSignup);

router.post('/user/login', isActive, authController.userLogin);

router.get('/admins', isAuth, authController.getAdmins);

router.delete('/admin/:adminId', isAuth, authController.deleteAdmin);


module.exports = router;



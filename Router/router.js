const express = require('express');
const router = express.Router();
const controller = require('../controller/controller');

// Routes to render forms
router.get('/', controller.defultCon);
router.get('/singup', controller.SingupForm);
router.get('/login', controller.LoginForm);

// Use POST for form submission (e.g., signup and login data)
router.post('/signup', controller.handleSignup);
router.post('/login', controller.handleLogin);

router.get('/logout', controller.handleLogout);

module.exports = router;

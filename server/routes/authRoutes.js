const express = require('express');
const router = express.Router();
const { loginUser, registerUser } = require('../controllers/authController');

const { validate, registerSchema, loginSchema } = require('../middleware/validation');

router.post('/login', validate(loginSchema), loginUser);
router.post('/register', validate(registerSchema), registerUser);

module.exports = router;

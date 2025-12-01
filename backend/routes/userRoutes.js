const express = require('express');
const userRoutes = express.Router();

const {
  getUserTokenStatus
} = require('../controller/userController');

userRoutes
  .route('/user-token-status')
  .get(getUserTokenStatus);

module.exports = userRoutes;
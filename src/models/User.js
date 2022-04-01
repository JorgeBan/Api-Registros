const Sequelize = require('sequelize');
const sequelize = require('../database/database')

const User = sequelize.define('users', {
  email:{
      type: Sequelize.STRING,
      primaryKey: true
  },
  name:{
      type: Sequelize.STRING
  },
  password:{
      type: Sequelize.STRING
  }   
});

module.exports = User
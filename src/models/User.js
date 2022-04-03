const Sequelize = require('sequelize');
const sequelize = require('../database/database')

const User = sequelize.define('users', {
  email:{
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false,
      unique: {
          msg: "El usuario ya existe"
      },
      validate:{
        isEmail:{
            msg: 'Debe introducir un correo electrónico valido'
        }
      }
  },
  name:{
      type: Sequelize.STRING,
      allowNull: false,
      validate:{
          isAlpha:{
              msg: 'El nombre solo debe contener letras'
          },
          len:{
              args: [4,255],
              msg: 'El nombre debe contener al menos 4 letras'
          }
      }
  },
  password:{
      type: Sequelize.STRING,
      allowNull: false,
      len:{
          args: [6,255],
          msg: 'La contraseña debe tener al menos 6 caracteres'
      }
  }   
}, {
    timestamps: false,
});

module.exports = User
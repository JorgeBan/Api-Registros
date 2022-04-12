const bcrypt = require('bcryptjs')
const user = require('../models/User')
const jwt = require('jsonwebtoken');

const tokenConfig = require('../config/jwtConfig')
const mailConfig = require('../config/mailConfig')

async function login(req, res) {
        let userData = req.body
        user.findOne({
            where: {
                email: userData.email
            }
        }).then(myUser =>{
            if(!myUser){
                res.json({
                    error: true,
                    code: 401,
                    msg: 'El usuario no existe'
                })
            }else{
                if(bcrypt.compareSync(userData.password, myUser.password)){
                    let token = tokenConfig.getToken(myUser) 
                    res.json({
                        error: false,
                        code: 200,
                        msg: 'Inicio de sesion exitosa',
                        data: myUser,
                        token: token,
                    })
                }else{
                    res.json({
                        error: true,
                        code: 401,
                        msg: 'Contraseña incorrecta'
                    })
                }
            }
        }).catch(err=>{
            res.json({
                error: true,
                code: 500,
                msg: err.message
            })
        })
}


async function storeUser(req, res) {
    let userData = req.body
    let passCryp = await bcrypt.hash(userData.password, Number.parseInt(process.env.AUTH_ROUNDS))
    user.create({
        email: userData.email,
        name: userData.name,
        password: passCryp
    }).then(newUser => {
         let token = tokenConfig.getToken(newUser) 
         
         const template = mailConfig.getTemplate(userData.name,token) 
         
         mailConfig.sendMail(userData.email, 'Confirmar cuenta', template)

         res.json({
                error: false,
                code: 200,
                msg: 'Usuario creado con exito',
                data: newUser,
                token: token,

            })
    }).catch(err => {
        res.json({
            error: true,
            code: 500,
            msg: err.message,
        });
    })
}

async function confirmUser(req, res) {
    let token = req.params.token
    let data = tokenConfig.getTokenData(token)
    if(data === null){
        res.json({
            error: true,
            code: 401,
            msg: 'Token invalido'     
        })
    }else{
        user.findOne({
            where: {
                email: data.data.email
            }
        }).then(myUser =>{
            if(!myUser){
                res.json({
                    error: true,
                    code: 401,
                    msg: 'El usuario no existe'
                })
            }else{
                myUser.status = 'VERIFIED'
                myUser.save()
                res.send('<h1>Usuario confirmado</h1> <a href="http://localhost:8081/login">Ingresar</a>')
            }
        })        
    }

    
}

module.exports = {
    storeUser,
    login,
    confirmUser
}
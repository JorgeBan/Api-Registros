const bcrypt = require('bcryptjs')
const user = require('../models/User')
const jwt = require('jsonwebtoken');


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
                    let token = jwt.sign({user: myUser,
                    }, process.env.AUTH_SECRET, {
                        expiresIn: process.env.AUTH_EXPIRES
                    })

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
        let token = jwt.sign({
            user: newUser}, process.env.AUTH_SECRET,
            {
                expiresIn: process.env.AUTH_EXPIRES
            })
            
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

module.exports = {
    storeUser,
    login
}
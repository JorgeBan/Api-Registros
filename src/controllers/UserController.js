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
                res.status(404).json({
                    message: 'El usuario no existe'
                })
            }else{
                if(bcrypt.compareSync(userData.password, myUser.password)){
                    let token = jwt.sign({user: myUser,
                    }, process.env.AUTH_SECRET, {
                        expiresIn: process.env.AUTH_EXPIRES
                    })

                    res.json({
                        user: myUser,
                        token: token
                    })
                }else{
                    res.status(401).json({message: 'Contraseña incorrecta'})
                }
            }
        }).catch(err=>{
            res.status(500).json(err)
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
                user: newUser,
                token: token
            })
    }).catch(err => {
        res.status(500).json(err);
    })
}

module.exports = {
    storeUser,
    login
}
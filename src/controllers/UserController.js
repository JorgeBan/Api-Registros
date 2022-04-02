const bcrypt = require('bcryptjs')
const user = require('../models/User')


async function getUser(res, email) {
    const userData = await user.findOne({
         where: { 
             email
        }
    })
    res.json(userData)

}

async function storeUser(req, res) {
    const userData = req.body
    const passCryp = await bcrypt.hash(userData.password, 12)
    const userVerify = await getUser(res, userData.email)
    if(userVerify === null){
        try {
            res.json({message: 'ppppp'})
        }catch(err){
            res.json({"error": err.toString()})
        }
    }
}

module.exports = {
    storeUser
}
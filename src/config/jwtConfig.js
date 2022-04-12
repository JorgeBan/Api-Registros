const jwt = require('jsonwebtoken');

const getToken = (payload) => {
    return jwt.sign({
        data: payload,
    }, process.env.AUTH_SECRET, {expiresIn: process.env.AUTH_EXPIRES});
    
}

const getTokenData = (token) => {
    let data = null
    jwt.verify(token, process.env.AUTH_SECRET, (err, decoded) => {
        if(err){
            console.log("error al obtener el token",err)
        }else{	
            data = decoded
        }
    });
    return data
}

module.exports = {
    getToken,
    getTokenData
}
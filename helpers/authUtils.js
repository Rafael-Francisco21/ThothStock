const jwt = require('jsonwebtoken')

let criaJWT = (user)=>{
    let token = jwt.sign(
        {user : user.codigo, acesso: user.acesso}, 
        process.env.JWT_PWD
    )
    return token;
}

let validaJWT = function(req, res, next){
    let baerer = req.headers['authorization']
    let partes = baerer.split(' ')
    let token = partes[1];

    if (!token){
        return res.status(403).json({
            auth: false,
            msg: "Acesso negado!"
        })
    }
    jwt.verify(token, process.env.JWT_PWD, (err, obj) =>{
        if(err){
            return res.status(403).json({
                auth: false,
                msg: "Token inválido!"
            }) 
        }
        req.user = obj.user
        req.acesso = obj.acesso
        next()
    })
}


module.exports = {criaJWT, validaJWT}
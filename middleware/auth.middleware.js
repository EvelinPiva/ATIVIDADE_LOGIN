const cryptoJs = require('crypto-js')
const CHAVE_SECRETA = 'segredo' // deve ficar no arquivo .env

function authMiddleware(req,res,next){
    const token = req.headers['authorization']
    console.log(token)

    if(!token){
        return res.status(401).json({messsage: 'acesso negado! Faça o login para continuar'})
    }

    try{
        const bytes = cryptoJs.AES.decrypt(token, CHAVE_SECRETA)
        const dadosDescriptografados = bytes.toString(cryptoJs.enc.Utf8)

        if(!dadosDescriptografados){
            return res.status(403).json({messsage: ' Acesso proibido! '})
        }

        const payload = JSON.parse(dadosDescriptografados)

        if(Date.now > payload.expiraEm){
            return res.status(401).json({messsage: 'Sessão expirada! Faça o login para continuar '})
        }

    req.usuario = payload

    next()

    }catch(err){
        console.error('Falha na autenticação')
        return res.status(401).json({messsage: 'Falha na autenticação'})
    }
}

module.exports = authMiddleware
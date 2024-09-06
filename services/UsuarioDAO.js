const {DataTypes, Op} = require("sequelize")
const UsuarioModel = require('../model/Usuario')

module.exports = {
    
    create: async function(user) {
        return await UsuarioModel.create({
            nome: user.nome,
            email: user.email,
            senha: user.senha,
            acesso: user.acesso,
            contLogin: 0
        })   
    },

    getByEmail: async function(email) {
        return await UsuarioModel.findOne({where: {email: email}})
    },
    
    login: async function(email, senha) {
        let usuario = await UsuarioModel.findOne({where: {email: email, senha: senha}});
        if(usuario){
            let contLogin = usuario.dataValues.contLogin + 1
            let id = usuario.dataValues.codigo
            await UsuarioModel.update({ contLogin: contLogin},{ where: { codigo: id }})
        }
        return usuario
    },
    
    update: async function(id, user) {
        console.log(user)
        return await UsuarioModel.update({
            nome: user.nome,
            email: user.email,
            senha: user.senha,
            acesso: user.acesso
        },{ where: { codigo: id }})
    },

    getById: async function(id) {
        return await UsuarioModel.findByPk(id)
    },
    quantAdm: async function(){
        return await UsuarioModel.count({where: { acesso: 1}})
    },

    delete: async function(id) {
        return await UsuarioModel.destroy({where: { codigo: id }})
    },
    
    list: async function() {
        const usuario = await UsuarioModel.findAll({
            attributes: ['codigo', 'nome', 'acesso']
        })
        return usuario
    },
    
    listPage: async function(pagina, limite) {
        const offset = (pagina - 1) * limite;

        const limiteNumber = parseInt(limite, 10);
        if (isNaN(limiteNumber) || limiteNumber <= 0) {
            throw new Error('O limite deve ser um número positivo.');
        }
        
        const usuario = await UsuarioModel.findAll({
            attributes: ['codigo', 'nome', 'acesso'],
            limit: limiteNumber,
            offset: offset
        });
    
        return usuario;
    }
    
}
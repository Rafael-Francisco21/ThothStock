const {DataTypes, Op} = require("sequelize")
const UsuarioModel = require('../model/Usuario')

module.exports = {
    
    create: async function(user) {
        return await UsuarioModel.create({
            nome: user.nome,
            email: user.email,
            senha: user.senha,
            acesso: user.acesso
        })   
    },

    getByEmail: async function(email) {
        return await UsuarioModel.findOne({where: {email: email}})
    },
    
    login: async function(email, senha) {
        return await UsuarioModel.findOne({where: {email: email, senha: senha}})
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
        const usuario = await UsuarioModel.findAll()
        return usuario
    },
    
    listPage: async function(pagina, limite) {
        // Verifique se 'pagina' e 'limite' são números e estão corretos
        const paginaNumber = parseInt(pagina, 10);
        const limiteNumber = parseInt(limite, 10);
    
        if (isNaN(paginaNumber) || paginaNumber <= 0) {
            throw new Error('A página deve ser um número inteiro positivo.');
        }
    
        if (isNaN(limiteNumber) || limiteNumber <= 0) {
            throw new Error('O limite deve ser um número inteiro positivo.');
        }
    
        const offset = (paginaNumber - 1) * limiteNumber;
    
        console.log('Página:', paginaNumber);
        console.log('Limite:', limiteNumber);
        console.log('Offset:', offset);
    
        const usuario = await UsuarioModel.findAll({
            limit: limiteNumber,
            offset: offset
        });
    
        console.log('Resultados:', usuario); // Verifique o resultado da consulta
    
        return usuario;
    }
    
    
}
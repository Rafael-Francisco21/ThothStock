const { DataTypes, Op } = require("sequelize");
const VendaModel = require('../model/Venda');
const ClienteModel = require('../model/Cliente');
const UsuarioModel = require('../model/Usuario');

module.exports = {
    create: async function(venda) {
        return await VendaModel.create({
            data: venda.data,
            total: venda.total,
            clienteId: venda.clienteId,
            usuarioId: venda.usuarioId
        });
    },

    update: async function(id, venda) {
        return await VendaModel.update({
            data: venda.data,
            total: venda.total,
            clienteCodigo: venda.clienteCodigo,
            usuarioCodigo: venda.usuarioCodigo
        }, { where: { codigo: id } });
    },

    getById: async function(id) {
        return await VendaModel.findByPk(id, {
            include: [
                {
                    model: ClienteModel,
                    attributes: ['nome'],
                    as: 'Cliente' 
                },
                {
                    model: UsuarioModel,
                    attributes: ['nome'],
                    as: 'Usuario' 
                }
            ]
        });
    },

    delete: async function(id) {
        return await VendaModel.destroy({ where: { codigo: id } });
    },

    list: async function() {
        return await VendaModel.findAll(
            { include: [{
                model: ClienteModel,
                attributes: ['nome']
            }],
            attributes: ['codigo', 'total', 'data']}
        );
    },

    listPage: async function(pagina, limite) {
        const offset = (pagina - 1) * limite;
    
        const limiteNumber = parseInt(limite, 10);
        if (isNaN(limiteNumber) || limiteNumber <= 0) {
            throw new Error('O limite deve ser um número positivo.');
        }
    
        return await VendaModel.findAll({
            limit: limiteNumber,
            offset: offset,
            include: [{
                model: ClienteModel,
                attributes: ['nome']
            }],
            attributes: ['codigo', 'total', 'data']
        });
    }
};

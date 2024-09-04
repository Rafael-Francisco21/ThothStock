const CompraModel = require('../model/Compra');
const FornecedorModel = require('../model/Fornecedor');
const UsuarioModel = require('../model/Usuario');

module.exports = {
    create: async function(compra) {
        return await CompraModel.create({
            data: compra.data,
            total: compra.total,
            fornecedorId: compra.fornecedorId,
            usuarioId: compra.usuarioId
        });
    },

    update: async function(id, compra) {
        return await CompraModel.update({
            data: compra.data,
            total: compra.total,
            fornecedorId: compra.fornecedorId,
            usuarioId: compra.usuarioId
        }, { where: { codigo: id } });
    },

    getById: async function(id) {
        return await CompraModel.findByPk(id, {
            include: [
                {
                    model: FornecedorModel,
                    attributes: ['nome'],
                    as: 'Fornecedor' 
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
        return await CompraModel.destroy({ where: { codigo: id } });
    },

    list: async function() {
        return await CompraModel.findAll({
            include: [
                {
                    model: FornecedorModel,
                    attributes: ['nome']
                },
                {
                    model: UsuarioModel,
                    attributes: ['nome']
                }
            ],
            attributes: ['codigo', 'total', 'data']
        });
    },

    listPage: async function(pagina, limite) {
        const offset = (pagina - 1) * limite;

        const limiteNumber = parseInt(limite, 10);
        if (isNaN(limiteNumber) || limiteNumber <= 0) {
            throw new Error('O limite deve ser um número positivo.');
        }

        return await CompraModel.findAll({
            limit: limiteNumber,
            offset: offset,
            include: [
                {
                    model: FornecedorModel,
                    attributes: ['nome']
                },
                {
                    model: UsuarioModel,
                    attributes: ['nome']
                }
            ],
            attributes: ['codigo', 'total', 'data']
        });
    }
};

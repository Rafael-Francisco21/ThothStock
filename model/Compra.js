const { DataTypes } = require("sequelize");
const sequelize = require("../helpers/db");
const FornecedorModel = require('./Fornecedor');
const UsuarioModel = require('./Usuario');

const CompraModel = sequelize.define('Compra', 
    {
        codigo: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        data: {
            type: DataTypes.DATE,
            allowNull: false
        },
        total: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        fornecedorId: {
            type: DataTypes.INTEGER,
            references: {
                model: FornecedorModel,
                key: 'codigo'
            },
            allowNull: true
        },
        usuarioId: {
            type: DataTypes.INTEGER,
            references: {
                model: UsuarioModel,
                key: 'codigo'
            },
            allowNull: true
        }
    }, {
        freezeTableName: true,
        timestamps: false
    }
);

FornecedorModel.hasMany(CompraModel, { foreignKey: 'fornecedorId' });
UsuarioModel.hasMany(CompraModel, { foreignKey: 'usuarioId' });
CompraModel.belongsTo(FornecedorModel, { foreignKey: 'fornecedorId' });
CompraModel.belongsTo(UsuarioModel, { foreignKey: 'usuarioId' });

module.exports = CompraModel;

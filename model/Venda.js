const { DataTypes } = require("sequelize");
const sequelize = require("../helpers/db");
const ClienteModel = require("./Cliente");
const UsuarioModel = require("./Usuario");

const VendaModel = sequelize.define('Venda', 
    {
        codigo: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        data: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        total: {
            type: DataTypes.FLOAT,  
            allowNull: false
        },
        clienteId: {
            type: DataTypes.INTEGER,
            references: {
                model: ClienteModel,
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
    }, 
    {
        freezeTableName: true,
        timestamps: false
    }
);


ClienteModel.hasMany(VendaModel, { foreignKey: 'clienteId' });
UsuarioModel.hasMany(VendaModel, { foreignKey: 'usuarioId' });
VendaModel.belongsTo(ClienteModel, { foreignKey: 'clienteId' });
VendaModel.belongsTo(UsuarioModel, { foreignKey: 'usuarioId' });


module.exports = VendaModel;

const { DataTypes, Op } = require("sequelize"); 
const sequelize = require("../helpers/db");

const UsuarioModel = sequelize.define('Usuario', 
    {
        codigo: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        nome: {
            type: DataTypes.STRING, 
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        senha: {
            type: DataTypes.STRING,
            allowNull: false
        },
        acesso: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        freezeTableName: true,
        timestamps: false
      }
);


module.exports = UsuarioModel;

const { DataTypes } = require('sequelize');
const sequelizePaginate = require('sequelize-paginate');
const sequelize = require('.');

const Model = sequelize.define('stateType', {
        stateTypeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            field: 'StateTypeId'
        },
        name: {
            type: DataTypes.STRING(250),
            allowNull: true,
            field: 'Name'
        },
        description: {
            type: DataTypes.STRING(250),
            allowNull: true,
            field: 'Description'
        }
    }, {
        freezeTableName: true,
  createdAt: false,
  updatedAt: false
}
);

sequelizePaginate.paginate(Model);

module.exports = Model;

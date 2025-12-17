const { DataTypes } = require('sequelize');
const sequelizePaginate = require('sequelize-paginate');
const sequelize = require('.');

const Model = sequelize.define('stateTransition', {
        stateTypeId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'StateType',
                key: 'StateTypeId'
            },
            field: 'StateTypeId'
        },
        currentId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Status',
                key: 'StatusId'
            },
            field: 'CurrentId'
        },
        actionId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Action',
                key: 'ActionId'
            },
            field: 'ActionId'
        },
        nextId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Status',
                key: 'StatusId'
            },
            field: 'NextId'
        }
    }, {
        freezeTableName: true,
  createdAt: false,
  updatedAt: false
}
);

sequelizePaginate.paginate(Model);

module.exports = Model;

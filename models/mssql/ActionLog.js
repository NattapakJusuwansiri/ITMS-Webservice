const { DataTypes } = require('sequelize');
const sequelizePaginate = require('sequelize-paginate');
const sequelize = require('.');

const Model = sequelize.define('actionLog', {
    actionLogId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'ActionLogId'
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
    actionUserId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'User',
        key: 'UserId'
      },
      field: 'ActionUserId'
    },
    actionDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'ActionDate'
    }
  }, {
    freezeTableName: true,
  createdAt: false,
  updatedAt: false
}
);
sequelizePaginate.paginate(Model);

module.exports = Model;
            
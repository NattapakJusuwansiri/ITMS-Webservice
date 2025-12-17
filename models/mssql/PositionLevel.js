const { DataTypes } = require('sequelize');
const sequelizePaginate = require('sequelize-paginate');
const sequelize = require('.');

const Model = sequelize.define('positionLevel', {
    positionLevelId: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true,
      field: 'PositionLevelId'
    },
    orderNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'OrderNo'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      field: 'IsActive'
    }
  }, {
    freezeTableName: true,
  createdAt: false,
  updatedAt: false
}
);
sequelizePaginate.paginate(Model);

module.exports = Model;
            
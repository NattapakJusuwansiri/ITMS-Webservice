const { DataTypes } = require('sequelize');
const sequelizePaginate = require('sequelize-paginate');
const sequelize = require('.');

const Model = sequelize.define('position', {
    positionId: {
      type: DataTypes.STRING(250),
      allowNull: false,
      primaryKey: true,
      unique: "UC_Position",
      field: 'PositionId'
    },
    name: {
      type: DataTypes.STRING(250),
      allowNull: false,
      field: 'Name'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
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
            
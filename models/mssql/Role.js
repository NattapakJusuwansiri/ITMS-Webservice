const { DataTypes } = require('sequelize');
const sequelizePaginate = require('sequelize-paginate');
const sequelize = require('.');

const Model = sequelize.define('role', {
    roleId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'RoleId'
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'Name'
    },
    level: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'Level'
    },
    orderNo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'OrderNo'
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
            
const { DataTypes } = require('sequelize');
const sequelizePaginate = require('sequelize-paginate');
const sequelize = require('.');

const Model = sequelize.define('flowGroupMember', {
    flowGroupMemberId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'FlowGroupMemberId'
    },
    flowGroupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'FlowGroup',
        key: 'FlowGroupId'
      },
      unique: "UC_FlowGroupMember",
      field: 'FlowGroupId'
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'UserId'
      },
      unique: "UC_FlowGroupMember",
      field: 'UserId'
    }
  }, {
    freezeTableName: true,
  createdAt: false,
  updatedAt: false
}
);
sequelizePaginate.paginate(Model);

module.exports = Model;
            
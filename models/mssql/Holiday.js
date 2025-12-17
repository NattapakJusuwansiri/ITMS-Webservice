const { DataTypes } = require('sequelize');
const sequelizePaginate = require('sequelize-paginate');
const sequelize = require('.');

const Model = sequelize.define('holiday', {
    holidayId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'HolidayId'
    },
    holidayDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'HolidayDate'
    },
    description: {
      type: DataTypes.STRING(250),
      allowNull: true,
      field: 'Description'
    },
    crateUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'UserId'
      },
      field: 'CrateUserId'
    },
    updateUserId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'User',
        key: 'UserId'
      },
      field: 'UpdateUserId'
    },
    createDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'CreateDate'
    },
    updateDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'UpdateDate'
    }
  }, {
    freezeTableName: true,
  createdAt: false,
  updatedAt: false
}
);
sequelizePaginate.paginate(Model);

module.exports = Model;
            
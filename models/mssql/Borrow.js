const { DataTypes } = require('sequelize');
const sequelizePaginate = require('sequelize-paginate');
const sequelize = require('.');

const Model = sequelize.define('borrow', {
    dataId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'DataId'
    },
    borrowDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'BorrowDate'
    },
    returnDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'ReturnDate'
    },
    purpose: {
      type: DataTypes.STRING(250),
      allowNull: true,
      field: 'Purpose'
    },
    locationToUse: {
      type: DataTypes.STRING(250),
      allowNull: true,
      field: 'LocationToUse'
    },
    borrowItemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'BorrowItem',
        key: 'BorrowItemId'
      },
      field: 'BorrowItemId'
    }
  }, {
    freezeTableName: true,
  createdAt: false,
  updatedAt: false
}
);
sequelizePaginate.paginate(Model);

module.exports = Model;
            
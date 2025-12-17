const { DataTypes } = require('sequelize');
const sequelizePaginate = require('sequelize-paginate');
const sequelize = require('.');

const Model = sequelize.define('borrowItem', {
    borrowItemId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'BorrowItemId'
    },
    equiepmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Equiepment',
        key: 'EquiepmentId'
      },
      field: 'EquiepmentId'
    },
    isBorrow: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: 'IsBorrow'
    }
  }, {
    freezeTableName: true,
  createdAt: false,
  updatedAt: false
}
);
sequelizePaginate.paginate(Model);

module.exports = Model;
            
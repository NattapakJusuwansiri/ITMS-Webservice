const { DataTypes } = require('sequelize');
const sequelizePaginate = require('sequelize-paginate');
const sequelize = require('.');

const Model = sequelize.define('gspc', {
    dataId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'DataId'
    },
    shippingDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'ShippingDate'
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
    ticketId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'TicketId'
    },
    isSupporterId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'User',
        key: 'UserId'
      },
      field: 'ISSupporterId'
    },
    tel: {
      type: DataTypes.STRING(32),
      allowNull: true,
      field: 'Tel'
    },
    note: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'Note'
    },
    isAcceptPolicy: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: 'IsAcceptPolicy'
    },
    policyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Policy',
        key: 'PolicyId'
      },
      field: 'PolicyId'
    }
  }, {
    freezeTableName: true,
  createdAt: false,
  updatedAt: false
}
);
sequelizePaginate.paginate(Model);

module.exports = Model;
            
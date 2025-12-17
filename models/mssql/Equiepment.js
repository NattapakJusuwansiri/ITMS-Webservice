const { DataTypes } = require('sequelize');
const sequelizePaginate = require('sequelize-paginate');
const sequelize = require('.');

const Model = sequelize.define('equiepment', {
    equiepmentId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'EquiepmentId'
    },
    serialNumber: {
      type: DataTypes.STRING(64),
      allowNull: true,
      field: 'SerialNumber'
    },
    fixedAsset: {
      type: DataTypes.STRING(64),
      allowNull: true,
      field: 'FixedAsset'
    },
    equiepmentTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'EquiepmentType',
        key: 'EquiepmentTypeId'
      },
      field: 'EquiepmentTypeId'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: 'IsActive'
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'UserId'
      },
      field: 'OwnerId'
    },
    itAsset: {
      type: DataTypes.STRING(250),
      allowNull: true,
      field: 'ItAsset'
    },
    brand: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'Brand'
    },
    model: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'Model'
    },
    capacity: {
      type: DataTypes.FLOAT,
      allowNull: true,
      field: 'Capacity'
    },
    os: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'Os'
    },
    osVersion: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'OsVersion'
    },
    sectionCode: {
      type: DataTypes.STRING(250),
      allowNull: true,
      references: {
        model: 'Department',
        key: 'DepartmentId'
      },
      field: 'SectionCode'
    },
    macAddress: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'MacAddress'
    },
    ipAddress: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'IPAddress'
    },
    fileId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'File',
        key: 'FileId'
      },
      field: 'FileId'
    }
  }, {
    freezeTableName: true,
  createdAt: false,
  updatedAt: false
}
);
sequelizePaginate.paginate(Model);

module.exports = Model;
            
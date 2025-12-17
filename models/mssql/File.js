const { DataTypes } = require('sequelize');
const sequelizePaginate = require('sequelize-paginate');
const sequelize = require('.');

const Model = sequelize.define('file', {
    fileId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      field: 'FileId'
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'Name'
    },
    size: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'Size'
    },
    contentType: {
      type: DataTypes.STRING(250),
      allowNull: true,
      field: 'ContentType'
    },
    path: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'Path'
    },
    createDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'CreateDate'
    },
    updateDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'UpdateDate'
    },
    createUserId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'User',
        key: 'UserId'
      },
      field: 'CreateUserId'
    },
    updateUserId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'UpdateUserId'
    },
    fileTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'FileType',
        key: 'FileTypeId'
      },
      field: 'FileTypeId'
    },
    isTemp: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: 'IsTemp'
    }
  }, {
    freezeTableName: true,
  createdAt: false,
  updatedAt: false
}
);
sequelizePaginate.paginate(Model);

module.exports = Model;
            
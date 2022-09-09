import { Model, DataTypes } from 'sequelize';

const BRIEFCASE_TABLE = 'briefcase';

const briefcaseSchema = {
  case_id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  token_id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  type_of_demand: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: true,
  },
  place_of_case: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  crime: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  crime_data: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  place_of_crime: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  name_of_plaintiff: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  name_of_defendant: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  defendants_attorney: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  plaintiffs_attorney: {
    allowNull: false,
    type: DataTypes.STRING,
  },
};

class Briefcase extends Model {
  static associate() {
    // associate
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: BRIEFCASE_TABLE,
      modelName: 'Briefcase',
      timestamps: false,
    };
  }
}

export { BRIEFCASE_TABLE, briefcaseSchema, Briefcase };

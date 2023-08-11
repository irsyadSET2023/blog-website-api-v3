import { DataTypes } from "sequelize";
import postgressConnection from "../connection";

const Users = postgressConnection.define(
  "users",
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_admin: { type: DataTypes.BOOLEAN, allowNull: true },
  },
  { timestamp: true, paranoid: true, underscored: true }
);

export default Users;

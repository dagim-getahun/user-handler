const { Schema } = require("mongoose");
const { databaseConnection } = require("../../../connection/db");

const UsersSchemaObject = {
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  profile: {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    avatarUrl: {
      type: String,
    },
    bio: {
      type: String,
    },
  },
};

const UsersSchema = new Schema(UsersSchemaObject);

const UsersModel = databaseConnection.model("users", UsersSchema);
export default UsersModel;

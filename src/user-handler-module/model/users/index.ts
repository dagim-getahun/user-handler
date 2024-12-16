import UsersModel from "./Users";
import { MongooseResponseType } from "./Types";
import { UserType } from "./Types";

export default class {
  async GetUsers(arg: Record<string, any>): Promise<MongooseResponseType> {
    try {
      const data = await UsersModel.find(arg).exec();
      return {
        success: true,
        task: "fetchUsers",
        data: {
          count: data.length,
          body: data,
        },
        requestBody: arg,
      };
    } catch (error) {
      return {
        success: false,
        error: error,
        task: "fetchUsers",
        requestBody: arg,
      };
    }
  }
  async FindById(user_id: String): Promise<MongooseResponseType> {
    try {
      const data = await UsersModel.findById(user_id).exec();
      return {
        success: true,
        task: "fetchUserById",
        data: {
          count: data.length,
          body: data,
        },
        requestBody: user_id,
      };
    } catch (error) {
      return {
        success: false,
        task: "fetchUserById",
        error: error,
        requestBody: user_id,
      };
    }
  }

  async FindByIdAndUpdate(
    user_id: String,
    user_detail: Record<string, any>
  ): Promise<MongooseResponseType> {
    try {
      const updatedUser = await UsersModel.findByIdAndUpdate(
        user_id,
        user_detail,
        {
          new: true,
          runValidators: true,
        }
      ).exec();
      if (!updatedUser) {
        return {
          success: false,
          task: "modifyUser",
          message: "User not found",
        };
      }

      return {
        success: true,
        task: "modifyUser",
        data: updatedUser,
        message: "User information updated successfully",
      };
    } catch (error: any) {
      if (error.name === "ValidationError") {
        const validationErrors = Object.keys(error.errors).map((key) => ({
          field: key,
          message: error.errors[key].message,
        }));
        return {
          success: false,
          task: "modifyUser",
          message: "Validation failed",
          error: validationErrors,
        };
      } else if (error.code === 11000) {
        return {
          success: false,
          task: "modifyUser",
          message: "Duplicate field error",
          error: [{ message: "Duplicate field value detected" }],
        };
      } else {
        return {
          success: false,
          task: "modifyUser",
          message: "Error updating user",
          error: [{ message: error.message }],
        };
      }
    }
  }
  async AddNewuser(userInput: UserType): Promise<MongooseResponseType> {
    try {
      const newUser = new UsersModel(userInput);
      const savedUser = await newUser.save();
      return {
        success: true,
        task: "addNewUser",
        data: savedUser,
      };
    } catch (error: any) {
      if (error.name === "ValidationError") {
        const validationErrors = Object.keys(error.errors).map((key) => ({
          field: key,
          message: error.errors[key].message,
        }));
        return {
          success: false,
          task: "addNewUser",
          message: "Validation failed",
          data: { body: [userInput] },
          error: validationErrors,
        };
      } else if (error.code === 11000) {
        return {
          success: false,
          task: "addNewUser",
          message: "Duplicate field error",
          data: { body: [userInput] },
          error: [{ message: error.message }],
        };
      } else {
        return {
          success: false,
          task: "addNewUser",
          message: "Error saving user",
          data: { body: [userInput] },
          error: [{ message: error.message }],
        };
      }
    }
  }
}

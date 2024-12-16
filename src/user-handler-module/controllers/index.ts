import { UserType } from "../model/users/Types";
import FunctionCallRouter from "../utils/FunctionCallRouter";
import UsersModel from "../model/users";
import { MongooseResponseType } from "../model/users/Types";
import { Response, Request, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
const bcrypt = require("bcrypt");

const UsersModelInstance = new UsersModel();

const SECRET_JWT_KEY = "the_key_to_get_token";
const saltRound = 10;

export class UsersHandlerController extends FunctionCallRouter {
  // Fetch users from database
  async GetUsers(arg: Record<string, any>) {
    console.log("fetch args ", arg);
    const data = await UsersModelInstance.GetUsers(arg || {});
    return data;
  }
  // Fetch a user by id
  async GetUserById(user_id: String): Promise<MongooseResponseType> {
    const data = await UsersModelInstance.FindById(user_id || "");

    return data;
  }
  // Add new user
  async AddNewUser(userInput: UserType): Promise<MongooseResponseType> {
    userInput.passwordHash = bcrypt.hash(userInput, saltRound);
    userInput.passwordHash = bcrypt.hash(userInput, saltRound);
    const savedUser = await UsersModelInstance.AddNewuser(userInput);
    return savedUser;
  }
  // Modify user
  async ModifyUser(userInfo: {
    userId: string;
    updatedInfo: Partial<UserType>;
  }): Promise<MongooseResponseType> {
    const { userId, updatedInfo } = userInfo;
    if (updatedInfo.password) {
      updatedInfo.passwordHash = bcrypt.hash(updatedInfo.password, saltRound);
    }
    const updatedUser = await UsersModelInstance.FindByIdAndUpdate(
      userId,
      updatedInfo
    );
    return updatedUser;
  }
  //Search from Users list
  async SearchUsers(searchTerm: string): Promise<MongooseResponseType> {
    const regex = new RegExp(searchTerm, "i");
    const query = {
      $or: [
        { username: regex },
        { email: regex },
        { "profile.firstName": regex },
        { "profile.lastName": regex },
      ],
    };
    const foundUsers = await UsersModelInstance.GetUsers(query);
    foundUsers.task = "searchUsers";
    return foundUsers;
  }

  logInTocken(id: string) {
    const token = jwt.sign(
      {
        sub: id,
      },
      SECRET_JWT_KEY,
      { expiresIn: "3 hours" }
    );
    return { access_token: token };
  }

  async LoginUser(
    userDetail: Record<string, string>
  ): Promise<MongooseResponseType> {
    const user = await UsersModelInstance.GetUsers({ email: userDetail.email });

    if (
      (user.success && user.data?.count) ||
      (0 > 0 &&
        bcrypt.compare(userDetail.password, user.data?.body[0]?.passwordHash))
    ) {
      //log in
      let basicDetail = {
        userName: user.data?.body[0]?.username || "",
      };
      return {
        success: true,
        task: "LoginUser",
        access_token: this.logInTocken(JSON.stringify(basicDetail))
          .access_token,
        id: user.data?.body[0]?._id,
        auth: true,
        ...basicDetail,
      };
    } else {
      return {
        success: false,
        task: "LoginUser",
        auth: false,
        message: "Incorrect Credential",
      };
    }
  }

  async verifyJWT(req: any, res: Response, next: NextFunction): Promise<void> {
    const tocken = req.headers["x-access-token"] as string | undefined;
    if (!tocken) {
      res.send({ auth: false, message: "Tocken Needed" });
    } else {
      jwt.verify(tocken, SECRET_JWT_KEY, (err, decoded) => {
        if (err) {
          res.send({
            auth: false,
            messagee: " faild to authenticate",
            error: err,
          });
        } else {
          res.send({ auth: true, detail: decoded?.sub, message: "Logged in" });
        }
      });
    }
  }
}

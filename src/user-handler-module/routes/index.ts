const express = require("express");
import { UsersHandlerController } from "../controllers";

const userController = new UsersHandlerController();
const UserModuleRouter = express.Router();

// Fetch multiple users
UserModuleRouter.post("/fetch-users", (req: any, res: any) => {
  req.methodToCall = "GetUsers";
  req.functionArgument = req.body.fetchFilter || {};
  console.log("body ", req.body);
  userController.CallRouter(req, res);
});

// Fetch user by user_id
UserModuleRouter.get("/fetch-user/:user_id", (req: any, res: any) => {
  req.methodToCall = "GetUserById";
  req.functionArgument = req.params.user_id || "";
  userController.CallRouter(req, res);
});

//Add new User
const testUser = {
  newUserInfo: {
    username: "James Bond",
    email: "thenewemail@gmail.com",
    passwordHash: "@#r2mo323r2mc3",
    profile: {
      firstName: "John",
      lastName: "Doe",
      avatarUrl: "url/for/avatar.png",
      bio: "User Bio",
    },
  },
};
UserModuleRouter.post("/add-user", (req: any, res: any) => {
  req.methodToCall = "AddNewUser";
  req.functionArgument = req.body.newUserInfo;
  //   req.functionArgument = testUser.newUserInfo;
  userController.CallRouter(req, res);
});

// Update user info
const testUser2 = {
  newUserInfo: {
    username: "The James Bond",
    email: "theemail2@gmail.com",
    passwordHash: "pass",
    profile: {
      firstName: "James",
      lastName: "Bond",
      avatarUrl: "url/for/avatar.png",
      bio: "User Bio",
    },
  },
};
UserModuleRouter.post("/edit-user", (req: any, res: any) => {
  req.methodToCall = "ModifyUser";
  req.functionArgument = req.body.userInfo;
  //   req.functionArgument = {
  //     userId: "67139520c587706ee877e2d6",
  //     updatedInfo: testUser2.newUserInfo,
  //   };
  userController.CallRouter(req, res);
});

// Search user
UserModuleRouter.get("/search-user", (req: any, res: any) => {
  req.methodToCall = "SearchUsers";
  req.functionArgument = req.body.query;
  //   req.functionArgument = "gmail";
  userController.CallRouter(req, res);
});

// Login User
UserModuleRouter.post("/login-user", (req: any, res: any) => {
  req.methodToCall = "LoginUser";
  req.functionArgument = req.body.userDetail;
  userController.CallRouter(req, res);
});

// Authorize Access Token
UserModuleRouter.get("/auth-check", userController.verifyJWT);

export default UserModuleRouter;

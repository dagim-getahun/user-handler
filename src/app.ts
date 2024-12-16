const expressMain = require("express");
const app = expressMain();

app.use(expressMain.json());

import UserModuleRouter from "./user-handler-module/routes";

app.use("/users", UserModuleRouter);

app.listen(1010, () => {
  console.log("Server app running on 1010");
});

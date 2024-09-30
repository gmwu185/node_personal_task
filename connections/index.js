const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: `./.env.${process.env.NODE_ENV}` });

console.log("NODE_ENV", process.env.NODE_ENV);

let DB = "";
if (process.env.NODE_ENV === "prod") {
  DB = process.env.DATABASE.replace(
    "myFirstDatabase",
    process.env.DATABASE_COLLECTIONS
  ).replace("<password>", process.env.DATABASE_PASSWORD);
} else if (process.env.NODE_ENV === "dev") {
  DB = "mongodb://localhost:27017/" + process.env.DATABASE_COLLECTIONS;
}

let serverPath = "";
if (process.env.NODE_ENV === "prod") {
  serverPath = `${process.env.PROTOCOL}//${process.env.DOMAIN_SERVER}`;
} else {
  serverPath = `${process.env.PROTOCOL}//${process.env.DOMAIN_SERVER}:${process.env.CUSTOMPORT}`;
}

mongoose
  .connect(DB)
  .then((response) => {
    console.log(`資料庫連接成功 -> serverPath ${serverPath}`);
  })
  .catch((error) => {
    console.log("資料庫連接錯誤", error);
  });

import express from "express";
import bodyParser from "body-parser";
import IPFS from "ipfs-core";
import { BufferList } from "bl";
// import makeIpfsFetch from "ipfs-fetch";
import dotenv from "dotenv";
import cors from "cors";
import passport from "passport";
import LocalStrategy from "passport-local";
import session from "express-session";
import cookieParser from "cookie-parser";
import sqlite3 from "sqlite3";
import sqliteStoreFactory from "express-session-sqlite";

const userRouter = require("./routes/userRoutes");
const adminRouter = require("./routes/adminRoutes");

require("./strategies/JwtStrategy");
require("./strategies/LocalStrategy");
require("./authenticate");

// User information that is used to send thanks for rewards
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  address: string;
}

// Compliments
export interface Compliment {
  id: number;
  message: string;
}

// Connection app
const app = express();
const port = 3080;

dotenv.config();

app.use(bodyParser.json());
app.use(cookieParser("cookieSecret replace"));
app.use(cors({ origin: "https://localhost:3000" }));
// app.use(passport.session());
app.use(passport.initialize());

const SQLiteStore = sqliteStoreFactory(session);
const oneDay = 1000 * 60 * 60 * 24;
app.use(
  session({
    secret: "this secret needs to be replaced",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true, maxAge: oneDay },
    store: new SQLiteStore({
      driver: sqlite3.Database,
      path: "/tmp/sqlite.db",
      ttl: 1234,
      prefix: "sess:",
      cleanupInterval: 300000,
    }),
  })
);

app.use("/api/users", userRouter);
app.use("/api/admin", adminRouter);

// Below is still a work in progress
app.get("/api/getnft", async (req, res) => {
  const cid = req.query.cid.toString();
  const ipfs = await IPFS.create();
  let text = "";
  for await (const file of ipfs.get(cid)) {
    console.log(file.toString());
    text += file.toString();

    // const content = new BufferList();
    // for await (const chunk of file.content) {
    //   content.append(chunk);
    // }

    // console.log(content.toString());
  }
  // for await (const chunk of ipfs.cat(cid)) {
  //   chunks.push(chunk);
  // }
  // const text = Buffer.concat(chunks).toString();
  console.log(text);
  // const fetch = makeIpfsFetch({ ipfs });
  // const response = await fetch("ipfs://" + cid);
  // const text = response.text();
  // let content = "";
  // for await (const file of ipfs.get(cid)) {
  // const content = [];
  // if (file.content) {
  //   for await (const chunk of file.content) {
  //     content.push(chunk);
  //   }
  // }
  // content += file.toString();
  // }
  // console.log(text);
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.json(text);
});

app.listen(port, () => {
  console.log(`Server listening on the port::${port}`);
});

// process.on("SIGINT", db.close());

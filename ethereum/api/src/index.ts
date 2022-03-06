import express from "express";
import bodyParser from "body-parser";
import { constants } from "ethers";
import IPFS from "ipfs-core";
import { BufferList } from "bl";
// import makeIpfsFetch from "ipfs-fetch";
import db from "./db";
import dotenv from "dotenv";
import cors from "cors";
import pinataSDK from "@pinata/sdk";
import passport from "passport";
import LocalStrategy from "passport-local";
import crypto from "crypto";

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
const pinata = pinataSDK(
  process.env.PINATA_API_KEY,
  process.env.PINATA_SECRET_API_KEY
);

passport.use(
  new LocalStrategy(
    {
      usernameField: "address",
    },
    function verify(address: string, password: string, cb) {
      db.get(
        "SELECT rowid AS id, * FROM users WHERE address = ?",
        [address],
        (err, row) => {
          if (err) {
            return cb(err);
          }
          if (!row) {
            return cb(null, false, {
              message: "Incorrect address or password.",
            });
          }

          crypto.pbkdf2(
            password,
            row.salt,
            310000,
            32,
            "sha256",
            (err, hashedPassword) => {
              if (err) {
                return cb(err);
              }
              if (
                !crypto.timingSafeEqual(row.hashed_password, hashedPassword)
              ) {
                return cb(null, false, {
                  message: "Incorrect address or password.",
                });
              }
              return cb(null, row);
            }
          );
        }
      );
    }
  )
);

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, { id: user.id, username: user.address });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

app.use(bodyParser.json());
app.use(cors({ origin: "https://localhost:3000" }));

app.post(
  "/api/login",
  passport.authenticate("local"),
  (req, res) => {
    // console.log("Req");
    // console.log(req);
    console.log("Passport");
    console.log(passport);
    res.send("Logged");
  }
);

// Get request for all other users from the same company
app.get("/api/users/other", (req, res) => {
  // The address of the incoming REST get in order to narrow down the response to only the data
  // that is connected to the company which the address is coming from
  const accountAddress = req.query.accountAddress.toString();

  // If the incoming account address is not 0000 and is registered then narrow down the users
  // that are within the same company and send back.  Otherwise, send back an empty list
  if (accountAddress !== constants.AddressZero) {
    db.all(
      `SELECT rowid AS id, firstName, lastName, address FROM Users WHERE company IN (SELECT company FROM Users WHERE address = ?) AND address != ? ORDER BY lastName`,
      [accountAddress, accountAddress],
      (err, rows) => {
        if (err) {
          res.json(err);
        } else {
          res.json(rows);
        }
      }
    );
  } else {
    res.json([]);
  }
});

// Get request for all users from the same company
app.get("/api/users/all", (req, res) => {
  // The address of the incoming REST get in order to narrow down the response to only the data
  // that is connected to the company which the address is coming from
  const accountAddress = req.query.accountAddress.toString();

  if (accountAddress !== constants.AddressZero) {
    db.all(
      `SELECT rowid AS id, firstName, lastName, address FROM Users WHERE company IN (SELECT company FROM Users WHERE address = ?) ORDER BY lastName`,
      [accountAddress],
      (err, rows) => {
        if (err) {
          res.json(err);
        } else {
          res.json(rows);
        }
      }
    );
  } else {
    res.json([]);
  }
});

// REST response for get the compliments that are associated with the users company
app.get("/api/compliments", (req, res) => {
  // The address of the incoming REST get in order to narrow down the response to only the data
  // that is connected to the company which the address is coming from
  const accountAddress = req.query.accountAddress.toString();

  if (accountAddress !== constants.AddressZero) {
    db.all(
      `SELECT rowid AS id, message FROM Compliments WHERE company IN (SELECT company FROM Users WHERE address = ?)`,
      [accountAddress],
      (err, rows: Compliment[]) => {
        if (err) {
          res.json(err);
        } else {
          res.json(rows);
        }
      }
    );
  } else {
    res.json([]);
  }
});

app.post("/api/ipfsjson", (req, res) => {
  const jsonBody = req.body;

  const jsonName = jsonBody.description.replaceAll(" ", "_") + ".json";

  const options = {
    pinataMetadata: {
      name: jsonName,
    },
  };
  pinata
    .pinJSONToIPFS(jsonBody, options)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.json(err);
    });
});

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

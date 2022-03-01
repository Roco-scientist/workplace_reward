import express from "express";
import bodyParser from "body-parser";
import { constants } from "ethers";
import IPFS from "ipfs-core";
import { BufferList } from "bl";
// import makeIpfsFetch from "ipfs-fetch";
import {
  Compliment,
  queryCompliments,
  queryUsers,
  User,
  dbConnect,
} from "./db";
import dotenv from "dotenv";
import cors from "cors";
import pinataSDK from "@pinata/sdk";

// Connection app
const app = express();
const port = 3080;

dotenv.config();
const pinata = pinataSDK(
  process.env.PINATA_API_KEY,
  process.env.PINATA_SECRET_API_KEY
);

dbConnect()
  .then((db) => {
    app.use(bodyParser.json());
    app.use(cors({ origin: "http://localhost:3000" }));

    // Get request for all other users from the same company
    app.get("/api/users/other", async (req, res) => {
      // The address of the incoming REST get in order to narrow down the response to only the data
      // that is connected to the company which the address is coming from
      const accountAddress = req.query.accountAddress.toString();

      let otherUsers: User[];
      // If the incoming account address is not 0000 and is registered then narrow down the users
      // that are within the same company and send back.  Otherwise, send back an empty list
      if (accountAddress !== constants.AddressZero) {
        otherUsers = await queryUsers(accountAddress, db, false);
      } else {
        otherUsers = [];
      }
      // console.log("API other users:");
      // console.log(otherUsers);
      res.json(otherUsers);
    });

    // Get request for all users from the same company
    app.get("/api/users/all", async (req, res) => {
      // The address of the incoming REST get in order to narrow down the response to only the data
      // that is connected to the company which the address is coming from
      const accountAddress = req.query.accountAddress.toString();

      let allUsers: User[];
      // If the incoming account address is not 0000 and is registered then narrow down the users
      // that are within the same company and send back.  Otherwise, send back an empty list
      if (accountAddress !== constants.AddressZero) {
        allUsers = await queryUsers(accountAddress, db, true);
      } else {
        allUsers = [];
      }
      // console.log("API other users:");
      // console.log(otherUsers);
      res.json(allUsers);
    });

    // REST response for get the compliments that are associated with the users company
    app.get("/api/compliments", async (req, res) => {
      // The address of the incoming REST get in order to narrow down the response to only the data
      // that is connected to the company which the address is coming from
      const accountAddress = req.query.accountAddress.toString();

      let groupCompliments: Compliment[];
      if (accountAddress !== constants.AddressZero) {
        groupCompliments = await queryCompliments(accountAddress, db);
      } else {
        groupCompliments = [];
      }
      // console.log("API compliments:");
      // console.log(groupCompliments);
      res.json(groupCompliments);
    });

    app.post("/api/ipfsjson", async (req, res) => {
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
          res.json(result)
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
  })
  .catch((err) => {
    throw err;
  });

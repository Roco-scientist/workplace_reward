import express from "express";
import bodyParser from "body-parser";
import { constants } from "ethers";
import { Compliment, queryCompliments, queryUsers, User } from "./db";

// Connection app
const app = express();
const port = 3080;

app.use(bodyParser.json());

// Get request for all other users from the same company
app.get("/api/users", async (req, res) => {
  // The address of the incoming REST get in order to narrow down the response to only the data
  // that is connected to the company which the address is coming from
  const accountAddress = req.query.accountAddress.toString();

  let otherUsers: User[];
  // If the incoming account address is not 0000 and is registered then narrow down the users
  // that are within the same company and send back.  Otherwise, send back an empty list
  if (accountAddress !== constants.AddressZero) {
    otherUsers = await queryUsers(accountAddress);
  } else {
    otherUsers = [];
  }
  // console.log("API other users:");
  // console.log(otherUsers);
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.json(otherUsers);
});

// REST response for get the compliments that are associated with the users company
app.get("/api/compliments", async (req, res) => {
  // The address of the incoming REST get in order to narrow down the response to only the data
  // that is connected to the company which the address is coming from
  const accountAddress = req.query.accountAddress.toString();

  let groupCompliments: Compliment[];
  if (
    accountAddress !== constants.AddressZero
  ) {
    groupCompliments = await queryCompliments(accountAddress);
  } else {
    groupCompliments = [];
  }
  // console.log("API compliments:");
  // console.log(groupCompliments);
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.json(groupCompliments);
});

app.listen(port, () => {
  console.log(`Server listening on the port::${port}`);
});

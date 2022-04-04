import express from "express";
import { constants } from "ethers";
import db from "../db";

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

// Connection router
const router = express.Router();

// Get request for all other users from the same company
router.get("/other", (req, res) => {
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
router.get("/all", (req, res) => {
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
router.get("/compliments", (req, res) => {
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

module.exports = router;

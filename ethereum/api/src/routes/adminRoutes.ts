import express from "express";
import dotenv from "dotenv";
import pinataSDK from "@pinata/sdk";
import passport from "passport";
import { getToken, SESSION_TIME, verifyUser } from "../authenticate";
import db from "../db";

const cookie_options = {
  httpOnly: true,
  // Since localhost is not having https protocol,
  // secure cookies do not work correctly (in postman)
  secure: true,
  signed: true,
  // How long the JWT cookie is good for; 15 minutes * 60 seconds * 1000 milliseconds
  maxAge: SESSION_TIME * 1000,
  // sameSite: "none",
};

// Connection router
const router = express.Router();

router.post("/login", passport.authenticate("local"), (req, res) => {
  //, next) => {
  const token = getToken({ _id: req.user._id });
  // const refreshToken = getRefreshToken({ _id: req.user._id });
  db.get("SELECT id FROM users WHERE id = ?", req.user._id, (err, row) => {
    if (err) {
      res.statusCode = 500;
      res.send(err);
    } else {
      res.cookie("token", token, cookie_options);
      res.send({ success: true, token });
    }
  });
  // User.findById(req.user._id).then(
  //   (user) => {
  //     user.refreshToken.push({ refreshToken });
  //     user.save((err, user) => {
  //       if (err) {
  //         res.statusCode = 500;
  //         res.send(err);
  //       } else {
  //         res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
  //         res.send({ success: true, token });
  //       }
  //     });
  //   },
  //   (err) => next(err)
  // );
});

dotenv.config();
const pinata = pinataSDK(
  process.env.PINATA_API_KEY,
  process.env.PINATA_SECRET_API_KEY
);

router.post("/ipfsjson", verifyUser, (req, res) => {
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

module.exports = router;

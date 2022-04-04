import passport from "passport";
import LocalStrategy from "passport-local";
import crypto from "crypto";
import db from "../db";

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


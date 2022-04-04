import passport from "passport";
import jwt from "jsonwebtoken";

export const SESSION_TIME = 15 * 60;

export const getToken = (user) => {
  return jwt.sign(user, "jwt secret CHANGE ME", {
    expiresIn: SESSION_TIME,
  });
};

// Below not used yet
export const getRefreshToken = (user) => {
  return jwt.sign(user, "refresh secret CHANGE ME", {
    expiresIn: SESSION_TIME * 10,
  });
};

export const verifyUser = passport.authenticate("jwt", { session: false });

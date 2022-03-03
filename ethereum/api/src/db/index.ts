import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import { existsSync, readFile } from "fs";
import crypto from "crypto";
// import { assert } from "node";
//

const db = new sqlite3.Database("./src/db/worker_rewards.db");

db.serialize(() => {
  db.run(
    "CREATE TABLE IF NOT EXISTS Users ( \
    address VARCHAR(60) PRIMARY KEY NOT NULL, \
    firstName VARCHAR(20) NOT NULL, \
    lastName VARCHAR(20) NOT NULL, \
    company VARCHAR(100) NOT NULL, \
    hashed_password BLOB, \
    salt BLOB \
     )"
  );
  db.run(
    "CREATE TABLE IF NOT EXISTS Compliments ( \
    message VARCHAR(100) NOT NULL, \
    company VARCHAR(100) NOT NULL \
    )"
  );

  // create an initial user (username: alice, password: letmein)
  const salt = crypto.randomBytes(16);
  db.run(
    "INSERT OR IGNORE INTO users (address, firstName, lastName, company, hashed_password, salt) VALUES (?, ?, ?, ?, ?, ?)",
    [
      "0x3bD7736bB6feA5ebe2AC8eb7F380D0963D92d473",
      "Jon",
      "Smith",
      "1",
      crypto.pbkdf2Sync("letmein", salt, 310000, 32, "sha256"),
      salt,
    ]
  );
});

export = db;

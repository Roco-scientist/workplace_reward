import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { existsSync, readFile } from "fs";
// import { assert } from "node";

const dbConnect = async () => {
  // assert(existsSync("./worker_rewards.db") == true, "sqlite3 database file missing");
  if (!existsSync("./src/db/worker_rewards.db")) {
    // throw new AssertionError("sqlite3 database file missing");
    throw "sqlite3 database file missing";
  }
  const db = await open({
    filename: "./src/db/worker_rewards.db",
    driver: sqlite3.Database,
  });
  return db;
};

// User information that is used to send thanks for rewards
export interface User {
  name: string;
  address: string;
}

// Compliments
export interface Compliment {
  id: number;
  message: string;
}

export const initialize = async () => {
  readFile(".src/db/initialize_db.sql", async (err, buff) => {
    if (err) {
      throw err;
    }

    const db = await dbConnect();
    db.run(buff.toString(), [], (err) => {
      if (err) {
        throw err;
      }
    });
    await db.close();
  });
};

export const queryUsers = async (address: string) => {
  const db = await dbConnect();
  // console.log("Query user table");
  const otherUsers = await db.all<User[]>(
    `SELECT address, name FROM Users WHERE address != ? AND company IN (SELECT company FROM Users WHERE address = ?)`,
    [address, address]
  );
  await db.close();

  // console.log("Other users sent:");
  // console.log(otherUsers);
  return otherUsers;
};

export const queryCompliments = async (address: string) => {
  const db = await dbConnect();
  // console.log("Query compliments table");
  const compliments = await db.all<Compliment[]>(
    `SELECT rowid AS id, message FROM Compliments WHERE company IN (SELECT company FROM Users WHERE address = ?)`,
    [address]
  );
  await db.close();

  // console.log("Compliments sent:");
  // console.log(compliments);
  return compliments;
};

// export const addUser = await (address: string, name: string, company: string) => {
//   const db = await dbConnect();
//   db.run(
//     `INSERT INTO Users (address,name,company) VALUES (?,?,?)`,
//     [address, name, company],
//     (err) => {
//       if (err) {
//         throw err;
//       }
//     }
//   );
//   await db.close();
// };

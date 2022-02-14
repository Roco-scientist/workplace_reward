import express from 'express';
import bodyParser from 'body-parser';
import { constants } from 'ethers';

// Connection app
const app = express();
const port = 3080;

// User information that is used to send thanks for rewards
interface User {
  name: string;
  address: string;
  group: number;
}
const users: User[] = [
  {
    address: '0x3bD7736bB6feA5ebe2AC8eb7F380D0963D92d473',
    name: 'Jon',
    group: 1,
  },
  {
    address: '0x6cE09101fcE65B6619606a7e0B91ef85dD99B5e5',
    name: 'Mary',
    group: 1,
  },
  {
    address: '0xE701A32AB9423594a0Dc65f2590C09fAD1D07Ca0',
    name: 'Lucy',
    group: 1,
  },
];

// All users so far to make sure the user from incoming request is already registered
const addresses: string[] = users.map((user) => user.address);

// Compliments
interface Compliment {
  message: string;
  group: number;
}

const compliments: Compliment[] = [
  { message: "You're the best", group: 1 },
  { message: 'Could never have completed without you', group: 1 },
  { message: 'I owe you one', group: 1 },
];

app.use(bodyParser.json());

// Get request for all other users from the same group
app.get('/api/users', (req, res) => {
  // The address of the incoming REST get in order to narrow down the response to only the data
  // that is connected to the group which the address is coming from
  const accountAddress = req.query.accountAddress;
  let otherUsers: User[];
  // If the incoming account address is not 0000 and is registered then narrow down the users
  // that are within the same group and send back.  Otherwise, send back an empty list
  if (
    accountAddress !== constants.AddressZero &&
    addresses.includes(accountAddress.toString())
  ) {
    const user = users.find((userNew) => userNew.address === accountAddress);
    otherUsers = users.filter(
      (otherUser) =>
        otherUser.group === user.group && otherUser.address !== accountAddress
    );
  } else {
    otherUsers = [];
  }
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.json(otherUsers);
});

// REST response for get the compliments that are associated with the users group
app.get('/api/compliments', (req, res) => {
  // The address of the incoming REST get in order to narrow down the response to only the data
  // that is connected to the group which the address is coming from
  const accountAddress = req.query.accountAddress;

  let groupCompliments: Compliment[];
  if (
    accountAddress !== constants.AddressZero &&
    addresses.includes(accountAddress.toString())
  ) {
    const user = users.find((userNew) => userNew.address === accountAddress);
    groupCompliments = compliments.filter(
      (compliment) => compliment.group === user.group
    );
  } else {
    groupCompliments = [];
  }
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.json(groupCompliments);
});

app.listen(port, () => {
  console.log(`Server listening on the port::${port}`);
});

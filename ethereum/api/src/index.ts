import express from 'express';
import bodyParser from 'body-parser';
import { constants } from 'ethers';

const app = express();
const port = 3080;

const users = [
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

const addresses: string[] = users.map((user) => user.address);

const compliments = [
  { message: "You're the best", group: 1 },
  { message: 'Could never have completed without you', group: 1 },
  { message: 'I owe you one', group: 1 },
];

app.use(bodyParser.json());

app.get('/api/users', (req, res) => {
  const accountAddress = req.query.accountAddress;
  let otherUsers;
  if (accountAddress !== constants.AddressZero && addresses.includes(accountAddress.toString())) {
    const user = users.find((userNew) => userNew.address === accountAddress);
    otherUsers = users.filter(
      (otherUser) =>
        otherUser.group === user.group && otherUser.address !== accountAddress
    );
  } else {
    otherUsers = [];
  }
  console.log('api/users called');
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.json(otherUsers);
});

app.get('/api/compliments', (req, res) => {
  const accountAddress = req.query.accountAddress;

  let groupCompliments;
  if (accountAddress !== constants.AddressZero && addresses.includes(accountAddress.toString())) {
    const user = users.find((userNew) => userNew.address === accountAddress);
    groupCompliments = compliments.filter(
      (compliment) => compliment.group === user.group
    );
  } else {
    groupCompliments = [];
  }
  console.log('api/compliments called');
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.json(groupCompliments);
});

app.listen(port, () => {
  console.log(`Server listening on the port::${port}`);
});

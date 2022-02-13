import express from 'express';
import bodyParser from 'body-parser';

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

const compliments = [
  { message: "You're the best" },
  { message: 'Could never have completed without you' },
  { message: 'I owe you one' },
];

app.use(bodyParser.json());

app.get('/api/users', (req, res) => {
  console.log('api/users called');
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.json(users);
});

app.get('/api/compliments', (req, res) => {
  console.log('api/compliments called');
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.json(compliments);
});

app.listen(port, () => {
  console.log(`Server listening on the port::${port}`);
});

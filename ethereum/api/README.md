# Backend database needed for the front end to run

## Setup
Create a `.env` file in this directory.  It needs to contain:
```
export PINATA_API_KEY=<pinata_api_key>
export PINATA_SECRET_API_KEY=<pinata_secret_key>
export PINATA_JWT=<pinata_jwt>
```

## Run

`npm start`

## TEST

`curl -X POST  -H "Content-Type: application/json" -H "Accept:application/json" -d '{"address"="0000000","password"="letmein"}' http://localhost:3080/api/admin/login`

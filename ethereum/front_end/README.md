# Worker Rewards Front End

Make sure to deploy the ethereum smart contracts with the `--update-front-end` flag before running.
This adds the necessary contract info and deployment addresses to the front end for contract interaction.

- This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).  
  - Error fix added to tsconfig.json in compiler options
    - "suppressImplicitAnyIndexErrors": true
- Metamask wallet connection was bootstrapped with [useDapp](https://usedapp.io/).  
  - [Error fix found here](https://github.com/mswjs/msw/issues/1030#issuecomment-1009253387)
- Style was with [Material UI](https://mui.com/getting-started/installation/)

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Current front-end screenshot

![Thanks](.../../thanks.png)

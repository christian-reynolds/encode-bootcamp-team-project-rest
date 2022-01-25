# Stock Launch REST API

REST API that handles backend logic for this React app: https://github.com/christian-reynolds/encode-bootcamp-team-project-ui

The application is responsible for the following:
- Saving data to MongoDB
- Querying ERC20 Transfer events to get owners and their balances
- Creating Merkle Trees used for NFT whitelists
- Creating Merkle Proofs that are used for NFT claims

## Running the project locally

The application has a dependency on MongoDB.  MongoDB needs to be running on your machine to run all features of the app.

In the project directory, you can run:

### `npm i`
### `nodemon server.js`

var express = require('express');
let mongoose = require('mongoose');
const cors = require('cors');
let bodyParser = require('body-parser');
let dbConfig = require('./database/db');
const { getMerkleRoot, getProof } = require('./merkletree');
const { getBalances } = require("./web3");
const { getBlockNum } = require("./data");
const dotenv = require('dotenv');
dotenv.config();

// Express Route
const contractRoute = require('./routes/contract.route');

// Connecting mongoDB Database
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.db, {
  useNewUrlParser: true
}).then(() => {
  console.log('Database sucessfully connected!')
},
  error => {
    console.log('Could not connect to database : ' + error)
  }
)

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cors());
app.use('/contracts', contractRoute)

// This would get called from the React application to create and retrieve the merkle root
// Example URL to pass the contract addresses:
// http://localhost:8081/merkle/0x41fACac9f2aD6483a2B19F7Cb34Ef867CD17667D
app.get('/merkle/:address', async function (req, res) {
    const address = req.params.address;

    // Get the block number from when the contract was created
    const blockNum = await getBlockNum(address);
    console.log('blockNum: ', blockNum);

    // Get the ERC20 holders for the whitelist
    const data = await getBalances(address, blockNum);
    
    // Get each address from the dictionary
    const addressArray = Object.keys(data);

    // Create the Merkle Tree and send the Root back.  This will go into the ERC721 contract to be checked when claims occur
    res.end(getMerkleRoot(address, addressArray));
})

// This would get called from the React application with a single address when someone is trying to claim their NFT
// Example URL:
// http://localhost:8081/merkle-proof/0x41fACac9f2aD6483a2B19F7Cb34Ef867CD17667D
app.get('/merkle-proof/:address/:claimAddress', function (req, res) {
    let contractAddress = req.params.address;
    let claimAddress = req.params.claimAddress;

    res.send(getProof(contractAddress, claimAddress));
})

// This is just being used temporarily to test the function getBalances
// Example URL:
// http://localhost:8081/get-balances/0x41fACac9f2aD6483a2B19F7Cb34Ef867CD17667D
app.get('/get-balances/:address', async function (req, res) {
    let address = req.params.address;

    // This is an example of calling getBalances.  DO NOT DELETE
    let data = await getBalances(address);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    console.log(data);
    res.write(JSON.stringify(data));
    res.end();
})

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
})

// 404 Error
// app.use((req, res, next) => {
//     next(createError(404));
// });

app.use(function (err, req, res, next) {
    console.error(err.message);
    if (!err.statusCode) err.statusCode = 500;
    res.status(err.statusCode).send(err.message);
});
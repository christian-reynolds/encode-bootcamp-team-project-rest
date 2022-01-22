var express = require('express');
var app = express();
var cors = require('cors');
const { getMerkleRoot, getProof } = require('./merkletree');
const { getBalances } = require("./web3");
const dotenv = require('dotenv');
dotenv.config();

app.use(cors())

// This would get called from the React application to create and retrieve the merkle root
// Example URL to pass the contract addresses:
// http://localhost:8081/merkle/0x41fACac9f2aD6483a2B19F7Cb34Ef867CD17667D
app.get('/merkle/:address', async function (req, res) {
    let address = req.params.address;

    // Get the ERC20 holders for the whitelist
    let data = await getBalances(address);
    
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

    res.end(getProof(contractAddress, claimAddress));
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
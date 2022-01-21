var express = require('express');
var app = express();
const { getMerkleRoot, getProof } = require('./merkletree');

// This would get called from the React application to create and retrieve the merkle root
// Example URL/query string to pass the addresses:
// http://localhost:8081/merkle?address[]=0x41fACac9f2aD6483a2B19F7Cb34Ef867CD17667D&address[]=0x5178E1848AaFB9a1e8C7370205B2B6e680eCa323&address[]=0xA93Fbde736Be952019a3c32cFCc2065c1B2AcDf1
app.get('/merkle', function (req, res) {
    let addressArray = req.query.address;
    console.log(addressArray);
    res.end(getMerkleRoot(addressArray));
})

// This would get called from the React application with a single address when someone is trying to claim their NFT
// Example URL:
// http://localhost:8081/merkle/0x41fACac9f2aD6483a2B19F7Cb34Ef867CD17667D
app.get('/merkle/:address', function (req, res) {
    let address = req.params.address;
    console.log(address);
    res.end(getProof(address));
})

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
})
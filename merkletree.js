const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');
const fs = require("fs");

let whitelistAddresses = [
    '0x41fACac9f2aD6483a2B19F7Cb34Ef867CD17667D',
    '0x5178E1848AaFB9a1e8C7370205B2B6e680eCa323',
    '0xA93Fbde736Be952019a3c32cFCc2065c1B2AcDf1'
];

const leafNodes = whitelistAddresses.map(addr => keccak256(addr));
const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });

console.log('Whitelist Merkle Tree\n', merkleTree.toString());

// *** ABOVE THIS LINE IS ALL JUST FOR TESTING PURPOSES AND NEEDS TO BE REPLACED WITH REAL DATA ***

// This gets called with the list of addresses that we need to whitelist
exports.getMerkleRoot = (contractAddress, addressArray) => {
    // Save the addresses to json.  We will need it later to verify the proof
    const jsonContent = JSON.stringify(addressArray);
    fs.writeFile('./leafs/' + contractAddress + '.json', jsonContent, 'utf-8', (err) => {
        if (err) {
            return console.log(err);
        }
        console.log('The file was saved!');
    });

    const leafs = addressArray.map(addr => keccak256(addr));

    // TODO: We need to save this somewhere so that we can use it later with the getProof function
    const tree = new MerkleTree(leafs, keccak256, { sortPairs: true });
    const rootHash = tree.getRoot().toString('hex');

    return rootHash;
};

// This gets called from the UI, sending in the user's address.
// This proof then gets sent to the claim function in the smart contract
exports.getProof = (contractAddress, claimAddress) => {
    // Get the leafs from the saved json
    const rawdata = fs.readFileSync('./leafs/' + contractAddress + '.json');
    const addressArray = JSON.parse(rawdata);
    const leafs = addressArray.map(addr => keccak256(addr));

    // Recreate the tree
    const tree = new MerkleTree(leafs, keccak256, { sortPairs: true });

    // Hash the address that is trying to claim
    const leaf = keccak256(claimAddress);

    return tree.getHexProof(leaf).toString();
};
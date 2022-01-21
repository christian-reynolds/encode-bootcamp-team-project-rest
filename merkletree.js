const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');

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
exports.getMerkleRoot = (addressArray) => {
    const leafNodes = addressArray.map(addr => keccak256(addr));
    const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
    const rootHash = merkleTree.getRoot().toString('hex');

    // TODO: We need to save this somewhere so that we can use it later with the getProof function
    return rootHash;
};

// This gets called from the UI, sending in the user's address.
// This proof then gets sent to the claim function in the smart contract
exports.getProof = (address) => {
    const leaf = keccak256(address);

    return merkleTree.getHexProof(leaf).toString();
};
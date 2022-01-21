const Web3 = require('web3')

exports.getBalances = async (contractAddress) => {
    //OMG erc-20 contract abi and address as an example, should be the deployed erc-20 contract's abi & address
    const abi = [{"constant":true,"inputs":[],"name":"mintingFinished","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"unpause","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_amount","type":"uint256"}],"name":"mint","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"paused","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"finishMinting","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"pause","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_amount","type":"uint256"},{"name":"_releaseTime","type":"uint256"}],"name":"mintTimelocked","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Mint","type":"event"},{"anonymous":false,"inputs":[],"name":"MintFinished","type":"event"},{"anonymous":false,"inputs":[],"name":"Pause","type":"event"},{"anonymous":false,"inputs":[],"name":"Unpause","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}];

    //change mainnet to appropriate testnet: ropsten, rinkeby, goerli, kovan
    const infura_RPC_URL = process.env.INFURA_RPC_URL;
    const web3 = new Web3(infura_RPC_URL);

    // TODO: Replace this hardcoded value
    const example_block_number = 14046200; // as an example put in a recent block # from ethereum mainnet (last 50 blocks or so)

    // TODO: Replace this hardcoded address with the param being passed in
    const contract = new web3.eth.Contract(abi, "0xd26114cd6EE289AccF82350c8d8487fedB8A0C07");
    //balances dict
    let balances = {};

    const events = await contract.getPastEvents(
        'Transfer', 
        {
            fromBlock:  example_block_number, // fromBlock should be the block when the erc-20 contract was deployed
            toBLock: 'latest'
        }
    ); //note: this fromBlock, toBlock filter is likely unecessary for our purposes (since we want all transfers)

    //add all addresses to the balances dict
    events.forEach(event=> balances[event.returnValues.to]=0);
    events.forEach(event=>balances[event.returnValues.from]=0);
    //sum all "to" values to each address's balance
    events.forEach(event => balances[event.returnValues.to] = balances[event.returnValues.to] + event.returnValues.value);
    //subtract all "from" values for each address's balance
    events.forEach(event => balances[event.returnValues.from] = balances[event.returnValues.from] - event.returnValues.value);
    //display output
    for(var address in balances) {
        console.log(address,balances[address])
    };

    return balances;
};

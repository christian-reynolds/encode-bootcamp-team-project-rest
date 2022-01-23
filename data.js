// Contract Model
let contractSchema = require('./models/Contract');

exports.getBlockNum = async (contractAddress) => {
    let returnData;

    try {
        returnData = await contractSchema.findOne({ address: contractAddress });
    } catch (error) {
        console.log(error);
    };

    return returnData.createdBlock;
};

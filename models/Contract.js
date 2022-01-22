const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let contractSchema = new Schema(
    {
        address: {
            type: String
        },
        nftAddress: {
            type: String
        },
        createdBlock: {
            type: Number
        }
    },
    {
        collection: 'contract'
    }
)

module.exports = mongoose.model('Contract', contractSchema)
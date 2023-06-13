const mongoose = require('mongoose')

const SaleSchema = new mongoose.Schema({
    id:{
        type: Number,
    },
    date:{
        type: Date,
        required: true
    },
    user:{
        type: String,
        required: true
    },
    department:{
        type: String,
        default: "General"
    },
    software:{
        type: String,
        default: ""
    },
    seats:{
        type: Number,
        default: 0
    },
    amount:{
        type: Number,
        default: 0
    },
})

module.exports = mongoose.model('Software_Sales', SaleSchema)
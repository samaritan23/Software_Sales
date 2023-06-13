const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const mongoUri = "mongodb://localhost:27017/Sales_DB?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false"

const connectToMongo = async () => {
    await mongoose.connect(mongoUri)
}

module.exports = connectToMongo;
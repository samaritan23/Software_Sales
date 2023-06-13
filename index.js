const connectToMongo = require("./db")
const express = require('express')
var cors = require('cors')
require("dotenv").config()

connectToMongo();

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(cors())

// This will route the request to ./routes/sales
app.use('/api', require('./routes/sales'))

app.get('/', (req, res) => {
  res.send('This is SoftwareSales server!!')
})

app.listen(port, () => {
  console.log(`SoftwareSales server listening at http://localhost:${port}`)
})
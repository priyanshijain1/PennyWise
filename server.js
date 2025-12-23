const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const dotenv = require('dotenv')
const colors = require('colors')
const path = require('path')
const connectDb = require('./config/connectDb')

// CONFIG dot ENV FILE
dotenv.config();

// DATABASE CONNECTION
connectDb();

// REST OBJECT
const app = express()

// MIDDLEWARES
app.use(morgan('dev'))
app.use(express.json())
app.use(cors())

// ROUTES
app.use('/api/v1/users', require('./routes/userRoute'))
app.use('/api/v1/transactions', require("./routes/transactionRoutes"));

// SERVE STATIC FILES FROM REACT BUILD
app.use(express.static(path.join(__dirname, './client/build')));

// THE "CATCHALL" HANDLER
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './client/build/index.html'));
});

// PORT
const PORT = process.env.PORT || 8080

// LISTEN SERVER
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`.bgCyan.white);
});
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv')
//import routes
const authRoute = require('./routes/auth');


dotenv.config();

//connect to DB
mongoose.connect(
    process.env.DB_CONNECT ,
    { useNewUrlParser: true },
    ()=>{ console.log('Connected to Database!')
})

//middleware
app.use(express.json());
//routes middlewares
app.use('/api/user', authRoute);


app.listen(3000, () => console.log('server running'))
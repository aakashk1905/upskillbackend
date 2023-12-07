const app = require('./app');
const dotenv = require('dotenv');
const connectDatabase = require("./config/database")    

//configuring env 
dotenv.config({path: './backend/config/config.env'});

//connecting database
connectDatabase();


app.listen(process.env.PORT, ()=>{
    console.log('Listening on port : http://localhost:' + process.env.PORT);
})
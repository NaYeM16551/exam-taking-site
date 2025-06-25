const express = require('express');
const app = express();
require('express-async-errors');
require('dotenv').config();
const connectDB = require('./db/connect');
const authenticateUser = require('./middleware/authentication');


const authRoute=require('./routes/auth');
const userRoute=require('./routes/users');
const adminRoute=require('./routes/admin');
const courseRoute=require('./routes/courses');
const examRoute=require('./routes/exams');
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');




//middlewaare 
 app.use(express.json());
 app.use(express.urlencoded({ extended: true }));

 app.use('/api/v1',authRoute);
 app.use('/api/v1',userRoute);
 app.use('/api/v1',adminRoute);
 app.use('/api/v1',courseRoute);
 app.use('/api/v1',examRoute);

 app.use(notFoundMiddleware);
 app.use(errorHandlerMiddleware);


 const port = process.env.PORT || 5000;

 const start = async () => {
  try {
    // connectDB
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => console.log(`Server is listening port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
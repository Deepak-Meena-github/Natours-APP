const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');
const mongoose = require('mongoose');


const dbURL = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

const ConnectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};



mongoose.connect(dbURL, ConnectionParams)
  .then(con => {
    console.log('Connected to the database');
  
  })
  .catch(error => {
    console.error('Error connecting to the database:', error);
  });

  

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

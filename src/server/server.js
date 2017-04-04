const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

app.use(express.static(path.join(__dirname, '/../client/')));
app.use(express.static(path.join(__dirname, '/../node_modules')));
app.use(bodyParser.json());

const studentLoanRoute = require('./routes')

app.use('/', studentLoanRoute);

const port = process.env.PORT || 5000;

app.listen(port, (err) => {
  if(err) {
    console.log('Error occurred : ', err);
  }
  console.log('Server is listening to port : ', port);
});

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const port = process.env.PORT || 5000;
const app = express();

app.use(express.static(path.join(__dirname, '/../src/')));
app.use(express.static(path.join(__dirname, '/../node_modules')));
app.use(bodyParser.json());


app.listen(port, (err) => {
  if(err) {
    console.log('Error occured : ', err);
  }
  console.log('Server is listening to port : ', port);
})

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

app.use(express.static(path.join(__dirname, '/../client/')));
app.use(express.static(path.join(__dirname, '/../node_modules')));
app.use(bodyParser.json());

//to get the data from the website https://studentaid.ed.gov/sa/types/loans/interest-rates
//i created a route that would scrape the site for the needed data.

const studentLoanRoute = require('./routes')

app.use('/', studentLoanRoute)

app.post('/api/loaninfo', (req, res) => {
  res.send(req.body);
})


//set port
const port = process.env.PORT || 5000;

app.listen(port, (err) => {
  if(err) {
    console.log('Error occured : ', err);
  }
  console.log('Server is listening to port : ', port);
});

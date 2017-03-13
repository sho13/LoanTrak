const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

app.use(express.static(path.join(__dirname, '/../client/')));
app.use(express.static(path.join(__dirname, '/../node_modules')));
app.use(bodyParser.json());

//api call for the current rates

app.get('/api/currentrates', (req, res) => {
  const body = {
    directSubsidizedUndergrad: `3.76%`,
    directUnsubsidizedUndergrad: `3.76%`,
    directUnsubsidizedGrad: `5.31%`,
    directPlus: `6.31%`
  }
  res.send(body);
});

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

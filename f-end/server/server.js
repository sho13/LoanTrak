const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const port = process.env.PORT || 5000;
const app = express();

app.use(express.static(path.join(__dirname, '/../src/')));
app.use(express.static(path.join(__dirname, '/../node_modules')));
app.use(bodyParser.json());

app.get('/api/currentrates', (req, res) => {
  const body = {
    directSubsidizedUndergrad: `3.76%`,
    directUnsubsidizedUndergrade: `3.76%`,
    directUnsubsidizedGrad: `5.31%`,
    directPlus: `6.31%`
  }
  res.send(body);
})

app.listen(port, (err) => {
  if(err) {
    console.log('Error occured : ', err);
  }
  console.log('Server is listening to port : ', port);
})

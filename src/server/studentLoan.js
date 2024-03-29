const request = require('request');
const scraperjs = require('scraperjs');

module.exports = {
  getLoanInfo: (req, res) =>{
    request.get({
      url: `https://studentaid.ed.gov/sa/types/loans/interest-rates`
    }, (err, resp, body) => {
      if(err) {
        console.log('Error in GetLoanInfo call: ', err);
        return err;
      }
      //scraper that scraped the data needed from the website
      scraperjs.StaticScraper.create(`https://studentaid.ed.gov/sa/types/loans/interest-rates`)
        .scrape(function($) {
          return $("table p").map(function() {
            return $(this).text();
          }).get();
        })
        .then(function(data) {
          const body = {
              directSubsidizedUndergrad: data[6],
              directUnsubsidizedUndergrad: data[9],
              bankLoan: '4.2%',
              universityLoan: '4.0%'
            }
          return res.status(200).send(body);
        })
    })
  }
}

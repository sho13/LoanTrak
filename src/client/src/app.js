angular.module('Widget', ['chart.js', 'ng', 'ngMaterial', 'ngAnimate', 'ngAria'])

.factory('Services',($http) => {

  const rateSearch = () => {
    return $http.get(`/api/currentrates`)
    .then(response => response);
  }

  let options = {};

  const inputData = (options) => {
    return new Promise((resolve, reject) => {
      if(Object.keys(options).length === 0) {
        alert("Please fill in all information!")
        return
      } else if(Object.keys(options.scholarship).length === 0 || Object.keys(options.interest).length === 0 || Object.keys(options.loanPeriod).length === 0) {
        alert("Please fill in all information!")
        return
      }
      let data = {
        scholarship: parseInt(options.scholarship),
        interest: parseFloat(options.interest),
        loanPeriod: parseInt(options.loanPeriod),
        optionalPayment: options.optionalPayment ? parseFloat(options.optionalPayment) : null
      }

      let results = {
        scholarship: data.scholarship,
        monthlyPayment: parseFloat((((data.scholarship / data.loanPeriod) * data.interest) + (data.scholarship / data.loanPeriod)).toFixed(2)),
        optionalPayment: data.optionalPayment,
        months: data.loanPeriod,
        newMonths: null,
        labels: [],
        payments: [data.scholarship],
        alternativePayments: [data.scholarship],
        series: ['Minimal Amount', 'Your Payment Choice']
      }

      let scholarship = results.scholarship;
      let scholarship2 = results.scholarship;

      for(let i = 0; i < results.months; i++) {
        results.labels.push(i.toString());
        scholarship -= results.monthlyPayment;
        if(scholarship >= 0) {
          results.payments.push(parseFloat(scholarship.toFixed(2)))
        }
      }
      if(results.optionalPayment !== null) {
        results.newMonths = parseInt(scholarship2/results.optionalPayment)
        while(scholarship2 > 0) {
          scholarship2 -= results.optionalPayment;
          results.alternativePayments.push(parseFloat(scholarship2.toFixed(2)))
        }
        if(results.labels.length < results.newMonths) {
          results.labels = [];
          for(let i = 0; i < results.newMonths; i++) {
            results.labels.push(i.toString());
          }
        }
      }
      resolve(results)
    });
  }

  return {
    rateSearch: rateSearch,
    inputData: inputData,
    options: options,
  }

})

//current loan rates sidebar controller
.controller("CurrentRateCtrl", function($scope, Services) {
  $scope.rates = {};
  let element = document.getElementById("sidebar");

  openNav = () => {
    document.getElementById("side").style.width = "400px";
    document.getElementById("forms").style.marginLeft = "400px";
    document.getElementById("sidebar").style.marginLeft = "400px";
    document.getElementById("howMuch").style.marginLeft = "400px";
    if(document.getElementById("lines") !== null) {
        document.getElementById("lines").style.marginLeft = "400px";
    }
    element.open = true;
  }

  closeNav = () => {
    document.getElementById("side").style.width = "0";
    document.getElementById("forms").style.marginLeft = "0";
    document.getElementById("sidebar").style.marginLeft = "0";
    document.getElementById("howMuch").style.marginLeft = "0";
    if(document.getElementById("lines") !== null) {
        document.getElementById("lines").style.marginLeft = "0";
    }
    element.open = false;
  }

  $scope.currentRate = () => {
    Services.rateSearch()
    .then((response) => {
      let data = response.data;
      $scope.rates.directSubsidizedUndergrad = data.directSubsidizedUndergrad;
      $scope.rates.directUnsubsidizedUndergrad = data.directUnsubsidizedUndergrad;
      $scope.rates.bankLoan = data.bankLoan;
      $scope.rates.universityLoan = data.universityLoan;
    })
    if(element.open !== true) {
      openNav();
    } else if(element.open === true) {
      closeNav();
    }
  }
})

//chart renderer
.controller("InputController", function($scope, Services) {

  $scope.data = [];
  $scope.query = Services.options;

  $scope.input = function () {
    Services.inputData($scope.query)
    .then((data) => {
      const lines = document.getElementById("lines").style.marginLeft;
      const forms = document.getElementById("forms").style.marginLeft;

      if(forms === "400px" && lines === "" ){
        document.getElementById("lines").style.marginLeft = "400px"
      }

      $scope.monthly = data.monthlyPayment;
      $scope.months = data.months;
      $scope.newMonths = data.newMonths;
      $scope.monthly2 = data.optionalPayment;
      $scope.labels = data.labels;
      $scope.series = data.series;
      $scope.data = [data.payments, data.alternativePayments];
      $scope.showChart = true;

      $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }];
      $scope.options = {
        title: {
          display: true,
          text: 'Your Payments',
          fontFamily: "'Exo', sans-serif",
          fontSize: 15
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes:[{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Months'
            }
          }],
          yAxes: [
            {
              id: 'y-axis-1',
              type: 'linear',
              display: true,
              position: 'left',
              scaleLabel: {
                display: true,
                labelString: 'How Much You Owe'
              }
            }
          ]
        }
      };
    })
  }
})

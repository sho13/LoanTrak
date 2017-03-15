angular.module('Widget', ['chart.js', 'ng', 'ngMaterial', 'ngAnimate', 'ngAria'])

.factory('Services',($http) => {

  const rateSearch = () => {
    return $http.get(`/api/currentrates`)
    .then(response => response);
  }

  let options = {};

  const inputData = () => {
    return $http.post(`/api/loaninfo`, options)
    .then((response) => {
      if(Object.keys(response.data).length === 0) {
        alert("Please fill in all information!")
        return
      } else if(Object.keys(response.data.scholarship).length === 0 || Object.keys(response.data.interest).length === 0 || Object.keys(response.data.loanPeriod).length === 0) {
        alert("Please fill in all information!")
        return
      }

      let data = {
        scholarship: parseInt(response.data.scholarship),
        interest: parseFloat(response.data.interest),
        loanPeriod: parseInt(response.data.loanPeriod)
      }

      let results = {
        scholarship: data.scholarship,
        monthlyPayment: parseFloat(((data.scholarship * data.interest) / data.loanPeriod).toFixed(2)),
        months: data.loanPeriod,
        labels: [],
        payments: [data.scholarship],
        series: ['Scholarship']
      }

      let scholarship = results.scholarship;

      for(let i = 0; i < results.months; i++) {
        results.labels.push(i.toString());
        scholarship -= results.monthlyPayment;
        if(scholarship >= 0) {
            results.payments.push(parseFloat(scholarship.toFixed(2)))
        }
      }

      return results
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
    element.open = true;
  }

  closeNav = () => {
    document.getElementById("side").style.width = "0";
    element.open = false;
  }


  $scope.currentRate = () => {
    Services.rateSearch()
    .then((response) => {
      console.log('hello');
      let data = response.data;
      $scope.rates.directSubsidizedUndergrad = data.directSubsidizedUndergrad;
      $scope.rates.directUnsubsidizedUndergrad = data.directUnsubsidizedUndergrad;
      $scope.rates.directUnsubsidizedGrad = data.directUnsubsidizedGrad;
      $scope.rates.directPlus = data.directPlus;
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
    .then((response) => {
      return response
    })
    .then((data) => {
      $scope.monthly = data.monthlyPayment;
      $scope.months = Services.options.loanPeriod;
      $scope.labels = data.labels;
      $scope.series = data.series;
      $scope.data = [data.payments];

      $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }];
      $scope.options = {
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

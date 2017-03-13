angular.module('Widget', ['chart.js'])

.factory('Services',($http) => {

  const rateSearch = () => {
    return $http.get(`/api/currentrates`)
    .then(response => response);
  }

  let options = {};

  var result = {};

  const inputData = () => {
    return $http.post(`/api/loaninfo`, options)
    .then((response) => {
      let data = {
        scholarship: parseInt(response.data.scholarship),
        interest: parseFloat(response.data.interest),
        loanPeriod: parseInt(response.data.loanPeriod)
      }
      return data;
    })
    .then((data) => {
      var results = {
        scholarship: data.scholarship,
        monthlyPayment: parseFloat(((data.scholarship * data.interest) / data.loanPeriod).toFixed(2)),
        months: data.loanPeriod,
        labels: [],
        payments: [data.scholarship],
        series: ['Scholarship']
      }

      let scholarship = results.scholarship;

      for(var i = 0; i < results.months; i++) {
        results.labels.push(i.toString());
        scholarship -= results.monthlyPayment;
        scholarship.toFixed(2)
        if(scholarship >= 0) {
            results.payments.push(scholarship)
        }
      }
      return results
    })
  }

  return {
    rateSearch: rateSearch,
    inputData: inputData,
    options: options,
    result: result
  }

})

//current loan rates
.controller("CurrentRate", function($scope, Services) {
  $scope.rates = {};
  $scope.currentRate = () => {
    Services.rateSearch()
    .then((response) => {
      let data = response.data;
      $scope.rates.directSubsidizedUndergrad = data.directSubsidizedUndergrad;
      $scope.rates.directUnsubsidizedUndergrad = data.directUnsubsidizedUndergrad;
      $scope.rates.directUnsubsidizedGrad = data.directUnsubsidizedGrad;
      $scope.rates.directPlus = data.directPlus;
    })
  }
})

.controller("InputController", function($scope, Services) {

  $scope.data = [];
  $scope.query = Services.options;

  $scope.input = function () {
    Services.inputData($scope.query)
    .then((response) => {
      console.log(response);
      return response
    })
    .then((data) => {
      $scope.labels = data.labels;
      $scope.series = data.series;
      $scope.data = [data.payments];

      $scope.onClick = function (points, evt) {

      };
      $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
      $scope.options = {
        scales: {
          yAxes: [
            {
              id: 'y-axis-1',
              type: 'linear',
              display: true,
              position: 'left'
            },
            {
              id: 'y-axis-2',
              type: 'linear',
              display: true,
              position: 'right'
            }
          ]
        }
      };
    })
  }


})
//
// .controller("LineCtrl", function ($scope, Services) {
//
//$scope.initData = () => {
//   console.log(Services.result)
//   $scope.labels = Services.result.labels;
//   $scope.series = Services.result.series;
//   $scope.data = [Services.result.data];
//   $scope.onClick = function (points, evt) {
//     console.log(points, evt);
//   };
//   $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
//   $scope.options = {
//     responsive: true,
//     scales: {
//       yAxes: [
//         {
//           id: 'y-axis-1',
//           type: 'linear',
//           display: true,
//           position: 'left'
//         },
//         {
//           id: 'y-axis-2',
//           type: 'linear',
//           display: true,
//           position: 'right'
//         }
//       ]
//     }
//   };
// }
//
// })

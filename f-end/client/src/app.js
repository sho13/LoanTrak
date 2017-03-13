angular.module('Widget', ['chart.js'])

.factory('Services',($http) => {

  const rateSearch = () => {
    return $http.get(`/api/currentrates`)
    .then(response => response);
  }

  let options = {};

  let results = {};

  const inputData = () => {
    return $http.post(`/api/loaninfo`, options)
    .then((response) => {
      let data = {
        scholarship: parseInt(response.data.scholarship),
        interest: parseInt(response.data.interest),
        loanPeriod: parseInt(response.data.loanPeriod)
      }
      return data;
    })
    .then((data) => {
      results = {
        scholarship: data.scholarship,
        monthlyPayment: (data.scholarship * data.interest) / data.loanPeriod,
        months: data.loanPeriod,
        labels: [],
        data: [data.scholarship],
        series: ['Scholarship']
      }

      let scholarship = results.scholarship;

      for(var i = 0; i < results.months; i++) {
        results.labels.push(i.toString());
        scholarship -= results.monthlyPayment
        console.log(scholarship);
        if(scholarship >= 0) {
            results.data.push(scholarship)
        }
      }
      console.log(results);
    });
  }

  return {
    rateSearch: rateSearch,
    inputData: inputData,
    options: options,
    results: results
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
  //   .then((response) => {
  //     let data = {
  //       scholarship: parseInt(response.data.scholarship),
  //       interest: parseInt(response.data.interest),
  //       loanPeriod: parseInt(response.data.loanPeriod)
  //     }
  //     return data;
  //   })
  //   .then((data) => {
  //     let math = {
  //       scholarship: data.scholarship,
  //       monthlyPayment: (data.scholarship * data.interest) / data.loanPeriod,
  //       months: data.loanPeriod
  //     }
  //     $scope.labels = [];
  //     $scope.series = ['Scholarship']
  //     $scope.data = [];
  //     // console.log(math.monthlyPayment)
  //     let scholarship = math.scholarship;
  //
  //     for(var i = 0; i < math.months; i++) {
  //       $scope.labels.push(i.toString());
  //       scholarship -= math.monthlyPayment
  //       if(scholarship >= 0) {
  //           $scope.data.push(scholarship)
  //       }
  //     }
  //     $scope.onClick = function (points, evt) {
  //       console.log(points, evt);
  //     };
  //     $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
  //     $scope.options = {
  //       scales: {
  //         yAxes: [
  //           {
  //             id: 'y-axis-1',
  //             type: 'linear',
  //             display: true,
  //             position: 'left'
  //           },
  //           {
  //             id: 'y-axis-2',
  //             type: 'linear',
  //             display: true,
  //             position: 'right'
  //           }
  //         ]
  //       }
  //     };
  //   })
  }


})

.controller("LineCtrl", function ($scope, Services) {


  $scope.initData = function() {
    $scope.labels = Services.results.labels;
    $scope.series = Services.results.series;
    $scope.data = [Services.results.data];
    $scope.onClick = function (points, evt) {
      console.log(points, evt);
    };
    $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }];
    $scope.options = {
      scales: {
        yAxes: [
          {
            id: 'y-axis-1',
            type: 'linear',
            display: true,
            position: 'left'
          }
        ]
      }
    };
  }
})

angular.module('Widget', ['chart.js'])

.factory('CurrentRates',($http) => {

  const rateSearch = () => {
    return $http({
      method: `GET`,
      url: `/api/currentrates`,
      headers: `text/html`
    })
    .then(response => response);
  }

  return {
    rateSearch: rateSearch
  }

})

//current loan rates
.controller("CurrentRate", function($scope, CurrentRates) {
  $scope.rates = {};
  $scope.currentRate = () => {
    CurrentRates.rateSearch()
    .then((response) => {
      let data = response.data;
      $scope.rates.directSubsidizedUndergrad = data.directSubsidizedUndergrad;
      $scope.rates.directUnsubsidizedUndergrad = data.directUnsubsidizedUndergrad;
      $scope.rates.directUnsubsidizedGrad = data.directUnsubsidizedGrad;
      $scope.rates.directPlus = data.directPlus;
    })
  }
})

.controller("InputController", function($scope) {

})

.controller("LineCtrl", function ($scope) {

  $scope.labels = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  $scope.series = ['Scholarship A', 'Series B'];
  $scope.data = [
    [65, 59, 80, 81, 56, 55, 40],
    [28, 48, 40, 19, 86, 27, 90]
  ];
  $scope.onClick = function (points, evt) {
    console.log(points, evt);
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

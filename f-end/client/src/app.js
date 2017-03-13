angular.module('Widget', [])

.factory('CurrentRates',($http) => {

  const rateSearch() => {
    return $http({
      method: `GET`,
      url: `/api/currentrates`
    })
    .then(response => response);
  }

})

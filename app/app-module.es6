(() => {
  'use strict';

  /* @ngdoc object
   * @name cmscubed
   * @description
   *
   */
  angular
    .module('cmscubed', [
      'ui.router',
      'home',
      'common',
      'ramda'
    ]);

  // ramda module
  angular.module('ramda', []);
  angular.module('ramda').factory('R', function ($window) {
    return $window.R;
  });

}());

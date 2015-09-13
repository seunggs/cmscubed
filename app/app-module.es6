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
      'ngSanitize',
      'ramda',
      'angular-medium-editor',
      'home',
      'common'
    ]);

  // ramda module
  angular.module('ramda', []);
  angular.module('ramda').factory('R', function ($window) {
    return $window.R;
  });

}());

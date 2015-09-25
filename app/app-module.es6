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
      'btford.socket-io',
      'home',
      'common'
    ])
    .constant('WEBSOCKET_URL', 'ws://localhost:8000');

  // ramda module
  angular.module('ramda', []);
  angular.module('ramda').factory('R', function ($window) {
    return $window.R;
  });

}());

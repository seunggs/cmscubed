(() => {
  'use strict';

  angular
    .module('cmscubed')
    .config(config);

  function config($urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');
  }
}());

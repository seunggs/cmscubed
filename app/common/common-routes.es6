(() => {
  'use strict';

  angular
    .module('common')
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('common', {
        url: '/common',
        templateUrl: 'common/common.tpl.html',
        controller: 'CommonCtrl',
        controllerAs: 'common'
      });
  }
}());

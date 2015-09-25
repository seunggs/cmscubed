(function () {
  'use strict';

  /**
   * @ngdoc service
   * @name common.factory:Config
   *
   * @description
   *
   */
  angular
    .module('common')
    .factory('Config', Config);

  function Config() {
    let ConfigBase = {};

    let hostName = 'http://localhost:8000';

    ConfigBase = {
      hostName: hostName
    };

    return ConfigBase;
  }
}());

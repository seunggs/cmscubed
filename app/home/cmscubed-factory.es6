(function () {
  'use strict';

  /**
   * @ngdoc service
   * @name home.factory:Cmscubed
   *
   * @description
   *
   */
  angular
    .module('home')
    .factory('Cmscubed', Cmscubed);

  function Cmscubed() {
    let CmscubedBase = {};
    CmscubedBase.someValue = 'Cmscubed';
    CmscubedBase.someMethod = () => {
      return 'Cmscubed';
    };
    return CmscubedBase;
  }
}());

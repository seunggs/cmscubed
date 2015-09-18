(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name common.directive:c3Repeat
   * @restrict EA
   * @element
   *
   * @description
   *
   * @example
     <example module="common">
       <file name="index.html">
        <c3-repeat></c3-repeat>
       </file>
     </example>
   *
   */
  angular
    .module('common')
    .directive('c3Repeat', c3Repeat);

  function c3Repeat() {
    return {
      restrict: 'EA',
      scope: {},
      templateUrl: 'common/c3-repeat-directive.tpl.html',
      replace: false,
      controllerAs: 'c3Repeat',
      controller() {
        let vm = this;
        vm.name = 'c3Repeat';
      },
      link(scope, element, attrs) {
        /* jshint unused:false */
        /* eslint "no-unused-vars": [2, {"args": "none"}] */
      }
    };
  }
}());

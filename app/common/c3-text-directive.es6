(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name common.directive:c3Text
   * @restrict EA
   * @element
   *
   * @description
   *
   * @example
     <example module="common">
       <file name="index.html">
        <c3-text></c3-text>
       </file>
     </example>
   *
   */
  angular
    .module('common')
    .directive('c3Text', c3Text);

  function c3Text() {
    return {
      restrict: 'EA',
      scope: {},
      templateUrl: 'common/c3-text-directive.tpl.html',
      replace: false,
      controllerAs: 'c3Text',
      controller() {
        let vm = this;
        vm.name = 'c3Text';
      },
      link(scope, element, attrs) {
        /* jshint unused:false */
        /* eslint "no-unused-vars": [2, {"args": "none"}] */

        
      }
    };
  }
}());
